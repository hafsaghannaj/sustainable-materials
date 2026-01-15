from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uvicorn
from datetime import datetime

from core.lca_engine import LCAEngine, LCAResult
from core.material_database import MaterialDatabase, MaterialPassport
from core.generative_design import GenerativeDesignEngine, DesignConstraint
from tasks import ping, celery_app

app = FastAPI(
    title="Bend the emissions curve of the built environment API",
    description="AI-Powered Sustainable Materials Marketplace",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
lca_engine = LCAEngine()
material_db = MaterialDatabase()
design_engine = GenerativeDesignEngine(material_db)

# Pydantic models
class MaterialInput(BaseModel):
    name: str
    category: str
    composition: Dict[str, float]
    manufacturing_process: str = "traditional"
    transportation_distance: float = 100
    recycled_content: float = 0
    cost_per_unit: float
    mechanical_properties: Optional[Dict] = {}
    certifications: Optional[List[str]] = []

class DesignRequest(BaseModel):
    building_area: float = Field(..., gt=0)
    components: List[str] = []
    max_budget: Optional[float] = None
    max_carbon: Optional[float] = None
    target_reduction: Optional[float] = Field(None, ge=0, le=100)

class SupplierRegistration(BaseModel):
    name: str
    contact: Dict
    specialties: List[str]
    sustainability_commitments: Optional[List[str]] = []

@app.get("/")
async def root():
    return {
        "message": "Welcome to Bend the emissions curve of the built environment API",
        "version": "1.0.0",
        "endpoints": {
            "materials": "/materials",
            "design": "/design/optimize",
            "lca": "/lca/calculate",
            "suppliers": "/suppliers"
        }
    }

@app.get("/health")
async def healthcheck():
    return {"status": "ok"}

@app.post("/materials/calculate-lca")
async def calculate_lca(material_data: MaterialInput):
    """Calculate LCA for a material"""
    try:
        lca_result = lca_engine.calculate_carbon_footprint(material_data.dict())
        carbon_label = lca_engine.generate_carbon_label(lca_result)
        
        return {
            "lca_results": lca_result.__dict__,
            "carbon_label": carbon_label,
            "material_id": f"MAT_{hash(str(material_data.dict()))}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/materials/register")
async def register_material(material_data: MaterialInput, supplier_id: str):
    """Register a new material in the database"""
    try:
        material_dict = material_data.dict()
        material_dict["supplier_id"] = supplier_id
        
        passport = material_db.add_material(material_dict, lca_engine)
        
        return {
            "status": "success",
            "material_id": passport.id,
            "carbon_label": passport.carbon_label,
            "blockchain_hash": passport.blockchain_hash
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/materials/search")
async def search_materials(
    category: Optional[str] = None,
    max_carbon: Optional[float] = None,
    min_recycled: Optional[float] = None,
    certifications: Optional[str] = None,
    max_cost: Optional[float] = None,
    sort_by: str = "sustainability"
):
    """Search for sustainable materials"""
    try:
        filters = {}
        if category:
            filters["category"] = category
        if max_carbon:
            filters["max_carbon"] = max_carbon
        if min_recycled:
            filters["min_recycled"] = min_recycled
        if certifications:
            filters["certifications"] = certifications.split(",")
        if max_cost:
            filters["cost_range"] = (0, max_cost)
        
        materials = material_db.search_materials(filters)
        
        # Format response
        results = []
        for mat in materials[:50]:  # Limit to 50 results
            results.append({
                "id": mat.id,
                "name": mat.name,
                "category": mat.category,
                "embodied_carbon": mat.lca_results.get("embodied_carbon", 0),
                "cost": mat.cost_per_unit,
                "recycled_content": mat.lca_results.get("recycled_content", 0),
                "certifications": [c.value for c in mat.certifications],
                "sustainability_score": material_db._calculate_sustainability_score(mat)
            })
        
        # Sort results
        if sort_by == "carbon":
            results.sort(key=lambda x: x["embodied_carbon"])
        elif sort_by == "cost":
            results.sort(key=lambda x: x["cost"])
        elif sort_by == "recycled":
            results.sort(key=lambda x: x["recycled_content"], reverse=True)
        else:  # sustainability
            results.sort(key=lambda x: x["sustainability_score"], reverse=True)
        
        return {
            "count": len(results),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/design/optimize")
async def optimize_design(request: DesignRequest):
    """Optimize material selection for a building design"""
    try:
        building_data = {
            "area": request.building_area,
            "components": request.components if request.components else []
        }
        
        constraints = DesignConstraint(
            max_budget=request.max_budget or float('inf'),
            max_carbon=request.max_carbon or float('inf')
        )
        
        alternatives = design_engine.optimize_material_selection(
            building_data, constraints
        )
        
        # Format alternatives
        formatted_alternatives = []
        for alt in alternatives[:10]:  # Return top 10 alternatives
            formatted_alternatives.append({
                "material_selections": alt.material_selections,
                "total_cost": alt.total_cost,
                "total_carbon": alt.total_carbon,
                "carbon_intensity": alt.total_carbon / request.building_area,
                "sustainability_score": alt.sustainability_score,
                "tradeoffs": alt.tradeoffs
            })
        
        return {
            "alternatives": formatted_alternatives,
            "building_area": request.building_area
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/design/recommend-swaps")
async def recommend_swaps(
    current_materials: Dict[str, str],
    target_reduction: float = Query(..., ge=0, le=100)
):
    """Recommend material swaps to achieve carbon reduction"""
    try:
        recommendations = design_engine.generate_recommendations(
            current_materials, target_reduction
        )
        
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/suppliers/register")
async def register_supplier(supplier_data: SupplierRegistration):
    """Register a new supplier"""
    try:
        supplier_id = f"SUP_{hash(str(supplier_data.dict()))}"
        
        material_db.suppliers[supplier_id] = {
            **supplier_data.dict(),
            "id": supplier_id,
            "registration_date": datetime.now().isoformat(),
            "materials_count": 0
        }
        
        return {
            "status": "success",
            "supplier_id": supplier_id,
            "message": "Supplier registered successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/dashboard")
async def get_analytics():
    """Get dashboard analytics"""
    try:
        total_materials = len(material_db.materials)
        total_suppliers = len(material_db.suppliers)
        
        # Calculate average carbon
        carbons = [
            m.lca_results.get("embodied_carbon", 0) 
            for m in material_db.materials.values()
        ]
        avg_carbon = sum(carbons) / len(carbons) if carbons else 0
        
        # Calculate carbon savings potential
        industry_avg = 2.5  # kg CO2e/kg for construction materials
        potential_savings = sum(
            max(0, industry_avg - carbon) 
            for carbon in carbons
        )
        
        return {
            "total_materials": total_materials,
            "total_suppliers": total_suppliers,
            "average_carbon": avg_carbon,
            "carbon_savings_potential": potential_savings,
            "material_categories": list(material_db.categories.keys()),
            "top_performing_materials": [
                {
                    "name": mat.name,
                    "carbon": mat.lca_results.get("embodied_carbon", 0),
                    "score": material_db._calculate_sustainability_score(mat)
                }
                for mat in list(material_db.materials.values())[:5]
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tasks/ping")
async def enqueue_ping():
    """Enqueue a Celery ping task"""
    task = ping.delay()
    return {"task_id": task.id}

@app.get("/tasks/status/{task_id}")
async def get_task_status(task_id: str):
    """Fetch Celery task status by id"""
    result = celery_app.AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": result.status,
        "result": result.result if result.ready() else None,
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
