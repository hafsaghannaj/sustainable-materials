import numpy as np
import pandas as pd
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import json
from pathlib import Path


class LCAMethod(Enum):
    """Standard LCA methodologies"""

    CML = "CML"
    TRACI = "TRACI"
    IMPACT_WORLD = "Impact World+"
    ECOINVENT = "Ecoinvent"


class MaterialCategory(Enum):
    STRUCTURAL = "structural"
    ENVELOPE = "envelope"
    INTERIOR = "interior"
    FINISHES = "finishes"
    MEP = "mep"


@dataclass
class LCAResult:
    """Standardized LCA results"""

    embodied_carbon: float  # kg CO2e per unit
    water_use: float  # liters per unit
    energy_use: float  # MJ per unit
    recycled_content: float  # percentage
    recyclability: float  # percentage
    toxicity_score: float  # 0-10 scale
    certifications: List[str]


class LCAEngine:
    """AI-powered Life Cycle Assessment Engine"""

    def __init__(self, db_path: str = "data/ecoinvent.db"):
        self.db_path = Path(db_path)
        self.impact_factors = self._load_impact_factors()
        self.ml_model = self._load_ml_model()

    def _load_impact_factors(self) -> Dict:
        """Load Ecoinvent impact factors"""
        # In production, this would connect to Ecoinvent API
        return {
            "concrete": {"GWP": 0.12, "AP": 0.0002, "EP": 0.00001},
            "steel": {"GWP": 1.85, "AP": 0.008, "EP": 0.0005},
            "wood": {"GWP": -0.9, "AP": 0.0001, "EP": 0.00002},
            "bamboo": {"GWP": -1.2, "AP": 0.00005, "EP": 0.00001},
            "mycelium": {"GWP": -0.5, "AP": 0.00001, "EP": 0.000005},
        }

    def _load_ml_model(self):
        """Load ML model for predictive LCA"""
        # This would be a trained model for predicting LCA based on material properties
        from sklearn.ensemble import RandomForestRegressor

        return RandomForestRegressor()

    def calculate_carbon_footprint(self, material_data: Dict) -> LCAResult:
        """
        Calculate cradle-to-gate carbon footprint

        Args:
            material_data: Dictionary containing material specifications
                - composition: Dict of materials and percentages
                - manufacturing_process: String
                - transportation_distance: float (km)
                - energy_source: String
                - recycled_content: float
        """

        # Extract material composition
        total_carbon = 0
        water_use = 0
        energy_use = 0

        for material, percentage in material_data.get("composition", {}).items():
            if material in self.impact_factors:
                impact = self.impact_factors[material]
                total_carbon += impact["GWP"] * percentage / 100
                water_use += impact.get("water", 0) * percentage / 100
                energy_use += impact.get("energy", 0) * percentage / 100

        # Adjust for manufacturing process
        process_factor = self._get_process_factor(
            material_data.get("manufacturing_process", "standard")
        )
        total_carbon *= process_factor

        # Add transportation emissions (assuming truck transport)
        transport_emissions = material_data.get("transportation_distance", 0) * 0.0001
        total_carbon += transport_emissions

        # Credit for recycled content
        recycled_content = material_data.get("recycled_content", 0)
        carbon_credit = (
            total_carbon * (recycled_content / 100) * 0.7
        )  # 70% credit for recycled content
        total_carbon -= carbon_credit

        # Calculate toxicity score
        toxicity_score = self._calculate_toxicity_score(material_data)

        # Generate certifications
        certifications = self._generate_certifications(total_carbon, recycled_content)

        return LCAResult(
            embodied_carbon=total_carbon,
            water_use=water_use,
            energy_use=energy_use,
            recycled_content=recycled_content,
            recyclability=material_data.get("recyclability", 70),
            toxicity_score=toxicity_score,
            certifications=certifications,
        )

    def _get_process_factor(self, process: str) -> float:
        """Get carbon multiplier for manufacturing process"""
        factors = {
            "traditional": 1.0,
            "low_energy": 0.8,
            "carbon_capture": 0.6,
            "renewable_energy": 0.7,
            "circular": 0.5,
        }
        return factors.get(process, 1.0)

    def _calculate_toxicity_score(self, material_data: Dict) -> float:
        """Calculate toxicity score based on chemical composition"""
        # Simplified toxicity assessment
        hazardous_components = material_data.get("hazardous_components", {})
        total_score = 0

        for component, amount in hazardous_components.items():
            toxicity = {
                "VOC": 3,
                "formaldehyde": 5,
                "lead": 8,
                "asbestos": 10,
                "phthalates": 4,
            }.get(component, 1)

            total_score += toxicity * amount

        return min(total_score, 10)  # Cap at 10

    def _generate_certifications(self, carbon: float, recycled: float) -> List[str]:
        """Generate certifications based on performance"""
        certs = []

        if carbon < 0.5:
            certs.append("Carbon Negative")
        elif carbon < 1.0:
            certs.append("Ultra Low Carbon")
        elif carbon < 2.0:
            certs.append("Low Carbon")

        if recycled > 90:
            certs.append("Cradle to Cradle Gold")
        elif recycled > 70:
            certs.append("Cradle to Cradle Silver")
        elif recycled > 50:
            certs.append("High Recycled Content")

        if carbon < 1.0 and recycled > 70:
            certs.append("Bend the emissions curve of the built environment Premium")

        return certs

    def generate_carbon_label(self, lca_result: LCAResult) -> Dict:
        """Generate a 'nutrition label' for carbon"""
        return {
            "embodied_carbon": {
                "value": lca_result.embodied_carbon,
                "unit": "kg CO2e/kg",
                "rating": self._get_carbon_rating(lca_result.embodied_carbon),
            },
            "circularity_score": self._calculate_circularity_score(lca_result),
            "environmental_impact": {
                "water_use": lca_result.water_use,
                "energy_use": lca_result.energy_use,
                "toxicity": lca_result.toxicity_score,
            },
            "certifications": lca_result.certifications,
            "comparison": self._get_industry_comparison(lca_result.embodied_carbon),
        }

    def _get_carbon_rating(self, carbon: float) -> str:
        """Get letter rating for carbon footprint"""
        if carbon < 0:
            return "A+"
        elif carbon < 0.5:
            return "A"
        elif carbon < 1.0:
            return "B"
        elif carbon < 2.0:
            return "C"
        elif carbon < 3.0:
            return "D"
        else:
            return "F"

    def _calculate_circularity_score(self, lca_result: LCAResult) -> float:
        """Calculate circularity score (0-100)"""
        score = (
            lca_result.recycled_content * 0.4
            + lca_result.recyclability * 0.4
            + (10 - lca_result.toxicity_score) * 10 * 0.2
        )
        return min(score, 100)

    def _get_industry_comparison(self, carbon: float) -> Dict:
        """Compare against industry averages"""
        industry_avg = {
            "concrete": 2.5,
            "steel": 3.2,
            "aluminum": 8.1,
            "wood": 0.5,
            "industry_average": 2.8,
        }

        comparison = {}
        for material, avg in industry_avg.items():
            reduction = ((avg - carbon) / avg) * 100 if avg > 0 else 0
            comparison[material] = {
                "average": avg,
                "reduction": reduction,
                "better": carbon < avg,
            }

        return comparison
