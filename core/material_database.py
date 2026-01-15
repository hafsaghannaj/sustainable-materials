from typing import List, Dict, Optional, Any
from dataclasses import dataclass, field
from datetime import datetime
import uuid
from enum import Enum
import hashlib
from .lca_engine import LCAEngine


class Certification(Enum):
    LEED = "LEED"
    BREEAM = "BREEAM"
    C2C = "Cradle to Cradle"
    EPD = "Environmental Product Declaration"
    FSC = "FSC"
    GREEN_GUARD = "GreenGuard"


@dataclass
class MaterialPassport:
    """Digital passport for sustainable materials"""

    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    description: str = ""
    category: str = ""

    # Environmental Data
    lca_results: Dict = field(default_factory=dict)
    carbon_label: Dict = field(default_factory=dict)

    # Technical Specifications
    mechanical_properties: Dict = field(default_factory=dict)
    thermal_properties: Dict = field(default_factory=dict)
    acoustic_properties: Dict = field(default_factory=dict)

    # Supply Chain Data
    supplier_id: str = ""
    origin: Dict = field(default_factory=dict)
    supply_chain_transparency: float = 0.0  # 0-100%

    # Economic Data
    cost_per_unit: float = 0.0
    availability: str = ""  # "in-stock", "made-to-order", "limited"
    lead_time: int = 0  # days

    # Certifications
    certifications: List[Certification] = field(default_factory=list)
    third_party_verified: bool = False

    # Blockchain Data
    blockchain_hash: str = ""
    creation_date: datetime = field(default_factory=datetime.now)
    last_updated: datetime = field(default_factory=datetime.now)

    def calculate_blockchain_hash(self) -> str:
        """Create immutable hash of material data"""
        data_string = (
            f"{self.id}{self.name}{self.lca_results}"
            f"{self.supplier_id}{self.creation_date}"
        )
        return hashlib.sha256(data_string.encode()).hexdigest()

    def to_json(self) -> Dict:
        """Convert passport to JSON format"""
        return {
            "id": self.id,
            "name": self.name,
            "carbon_label": self.carbon_label,
            "environmental_impact": self.lca_results,
            "technical_specs": {
                "mechanical": self.mechanical_properties,
                "thermal": self.thermal_properties,
                "acoustic": self.acoustic_properties,
            },
            "supply_chain": {
                "supplier": self.supplier_id,
                "origin": self.origin,
                "transparency_score": self.supply_chain_transparency,
            },
            "economic": {
                "cost": self.cost_per_unit,
                "availability": self.availability,
                "lead_time": self.lead_time,
            },
            "certifications": [cert.value for cert in self.certifications],
            "blockchain": {
                "hash": self.blockchain_hash,
                "created": self.creation_date.isoformat(),
                "updated": self.last_updated.isoformat(),
            },
        }


class MaterialDatabase:
    """Central repository for sustainable materials"""

    def __init__(self):
        self.materials: Dict[str, MaterialPassport] = {}
        self.suppliers: Dict[str, Any] = {}
        self.categories = self._initialize_categories()

    def _initialize_categories(self) -> Dict:
        """Initialize material categories"""
        return {
            "structural": ["concrete", "steel", "timber", "bamboo", "composite"],
            "insulation": ["fiberglass", "cellulose", "mycelium", "aerogel", "hemp"],
            "finishes": ["paint", "flooring", "cladding", "roofing", "glass"],
            "mep": ["piping", "wiring", "ducting", "panels"],
        }

    def add_material(self, material_data: Dict, lca_engine: "LCAEngine") -> MaterialPassport:
        """Add new material to database with LCA calculation"""

        # Calculate LCA
        lca_result = lca_engine.calculate_carbon_footprint(material_data)
        carbon_label = lca_engine.generate_carbon_label(lca_result)

        # Create material passport
        passport = MaterialPassport(
            name=material_data["name"],
            description=material_data.get("description", ""),
            category=material_data["category"],
            lca_results=lca_result.__dict__,
            carbon_label=carbon_label,
            mechanical_properties=material_data.get("mechanical_properties", {}),
            thermal_properties=material_data.get("thermal_properties", {}),
            acoustic_properties=material_data.get("acoustic_properties", {}),
            supplier_id=material_data["supplier_id"],
            origin=material_data.get("origin", {}),
            cost_per_unit=material_data["cost_per_unit"],
            availability=material_data.get("availability", "in-stock"),
            lead_time=material_data.get("lead_time", 14),
            certifications=self._parse_certifications(
                material_data.get("certifications", [])
            ),
        )

        # Generate blockchain hash
        passport.blockchain_hash = passport.calculate_blockchain_hash()

        # Store in database
        self.materials[passport.id] = passport

        return passport

    def _parse_certifications(self, cert_strings: List[str]) -> List[Certification]:
        """Parse certification strings to enum values"""
        certs = []
        for cert_str in cert_strings:
            try:
                certs.append(Certification(cert_str))
            except ValueError:
                # Try case-insensitive matching
                for cert in Certification:
                    if cert.value.lower() == cert_str.lower():
                        certs.append(cert)
                        break
        return certs

    def search_materials(self, filters: Dict) -> List[MaterialPassport]:
        """Search materials with advanced filtering"""
        results = list(self.materials.values())

        # Apply filters
        if "category" in filters:
            results = [m for m in results if m.category == filters["category"]]

        if "max_carbon" in filters:
            results = [
                m
                for m in results
                if m.lca_results.get("embodied_carbon", float("inf"))
                <= filters["max_carbon"]
            ]

        if "min_recycled" in filters:
            results = [
                m
                for m in results
                if m.lca_results.get("recycled_content", 0) >= filters["min_recycled"]
            ]

        if "certifications" in filters:
            required_certs = set(filters["certifications"])
            results = [
                m
                for m in results
                if required_certs.issubset({c.value for c in m.certifications})
            ]

        if "cost_range" in filters:
            min_cost, max_cost = filters["cost_range"]
            results = [
                m for m in results if min_cost <= m.cost_per_unit <= max_cost
            ]

        # Sort by sustainability score
        results.sort(key=lambda m: self._calculate_sustainability_score(m))

        return results

    def _calculate_sustainability_score(self, material: MaterialPassport) -> float:
        """Calculate overall sustainability score (0-100)"""
        lca = material.lca_results

        # Weighted average of multiple factors
        score = (
            (100 - min(lca.get("embodied_carbon", 10) * 10, 100)) * 0.4
            + lca.get("recycled_content", 0) * 0.3
            + lca.get("recyclability", 0) * 0.2
            + (10 - lca.get("toxicity_score", 10)) * 10 * 0.1
        )

        # Bonus for certifications
        cert_bonus = len(material.certifications) * 5
        if material.third_party_verified:
            cert_bonus += 10

        return min(score + cert_bonus, 100)

    def get_material_comparison(self, material_ids: List[str]) -> List[Dict]:
        """Compare multiple materials side by side"""
        comparison = []

        for mat_id in material_ids:
            if mat_id in self.materials:
                mat = self.materials[mat_id]
                comparison.append(
                    {
                        "id": mat.id,
                        "name": mat.name,
                        "carbon": mat.lca_results.get("embodied_carbon", 0),
                        "cost": mat.cost_per_unit,
                        "score": self._calculate_sustainability_score(mat),
                        "certifications": [c.value for c in mat.certifications],
                    }
                )

        return comparison

    def get_supplier_analytics(self, supplier_id: str) -> Dict:
        """Get analytics for a specific supplier"""
        supplier_materials = [
            m for m in self.materials.values() if m.supplier_id == supplier_id
        ]

        if not supplier_materials:
            return {}

        avg_carbon = sum(
            m.lca_results.get("embodied_carbon", 0) for m in supplier_materials
        ) / len(supplier_materials)

        avg_cost = sum(m.cost_per_unit for m in supplier_materials) / len(
            supplier_materials
        )

        return {
            "material_count": len(supplier_materials),
            "average_carbon": avg_carbon,
            "average_cost": avg_cost,
            "categories": list(set(m.category for m in supplier_materials)),
            "certification_count": sum(
                len(m.certifications) for m in supplier_materials
            ),
        }
