import numpy as np
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import json


@dataclass
class DesignConstraint:
    """Design constraints for generative design"""

    max_budget: float = float("inf")
    max_carbon: float = float("inf")
    min_recycled: float = 0
    certifications: List[str] = None
    material_categories: List[str] = None

    def __post_init__(self):
        if self.certifications is None:
            self.certifications = []
        if self.material_categories is None:
            self.material_categories = []


@dataclass
class DesignAlternative:
    """Alternative design solution"""

    material_selections: Dict[str, str]  # component -> material_id
    total_cost: float
    total_carbon: float
    sustainability_score: float
    tradeoffs: Dict[str, float]


class GenerativeDesignEngine:
    """AI-powered generative design for sustainable material selection"""

    def __init__(self, material_db: "MaterialDatabase"):
        self.material_db = material_db
        self.component_templates = self._load_component_templates()

    def _load_component_templates(self) -> Dict:
        """Load standard building component templates"""
        return {
            "foundation": {
                "materials": ["concrete", "steel", "timber_piles"],
                "quantity_per_m2": 0.3,  # m3/m2
            },
            "structure": {
                "materials": ["concrete", "steel", "timber", "bamboo"],
                "quantity_per_m2": 0.15,  # m3/m2
            },
            "walls": {
                "materials": ["concrete", "brick", "timber", "straw_bale"],
                "quantity_per_m2": 0.1,  # m3/m2
            },
            "insulation": {
                "materials": ["fiberglass", "mineral_wool", "cellulose", "mycelium"],
                "quantity_per_m2": 0.05,  # m3/m2
            },
            "roofing": {
                "materials": ["concrete", "steel", "clay", "green_roof"],
                "quantity_per_m2": 0.08,  # m3/m2
            },
            "flooring": {
                "materials": ["concrete", "timber", "bamboo", "recycled_rubber"],
                "quantity_per_m2": 0.02,  # m3/m2
            },
        }

    def optimize_material_selection(
        self, building_data: Dict, constraints: DesignConstraint
    ) -> List[DesignAlternative]:
        """
        Optimize material selection for a building design

        Args:
            building_data: Dictionary containing building specifications
                - area: float (m2)
                - components: Dict of component types and quantities
            constraints: Design constraints
        """

        area = building_data.get("area", 1000)  # default 1000 m2
        components = building_data.get("components", self.component_templates.keys())

        # Get all candidate materials
        candidate_materials = {}
        for component in components:
            if component in self.component_templates:
                template = self.component_templates[component]
                material_options = self.material_db.search_materials(
                    {
                        "category": component,
                        "max_carbon": constraints.max_carbon,
                        "min_recycled": constraints.min_recycled,
                        "certifications": constraints.certifications,
                    }
                )
                candidate_materials[component] = material_options[:10]  # Top 10 options

        # Generate alternatives using multi-objective optimization
        alternatives = self._generate_alternatives(
            candidate_materials, area, constraints
        )

        # Sort by sustainability score
        alternatives.sort(key=lambda x: x.sustainability_score, reverse=True)

        return alternatives

    def _generate_alternatives(
        self,
        candidate_materials: Dict[str, List],
        area: float,
        constraints: DesignConstraint,
    ) -> List[DesignAlternative]:
        """Generate design alternatives using genetic algorithm approach"""

        alternatives = []

        # Generate random combinations
        for _ in range(100):  # Generate 100 random alternatives
            selections = {}
            total_cost = 0
            total_carbon = 0

            for component, materials in candidate_materials.items():
                if materials:
                    # Random selection
                    selected = np.random.choice(materials)
                    selections[component] = selected.id

                    # Calculate quantities
                    template = self.component_templates.get(component, {})
                    quantity = template.get("quantity_per_m2", 0.1) * area

                    # Add to totals
                    total_cost += selected.cost_per_unit * quantity
                    total_carbon += (
                        selected.lca_results.get("embodied_carbon", 0) * quantity
                    )

            # Check constraints
            if total_cost <= constraints.max_budget and total_carbon <= constraints.max_carbon:
                # Calculate sustainability score
                sustainability_score = self._calculate_design_score(
                    selections, total_cost, total_carbon
                )

                # Calculate tradeoffs
                tradeoffs = self._calculate_tradeoffs(selections, candidate_materials)

                alternatives.append(
                    DesignAlternative(
                        material_selections=selections,
                        total_cost=total_cost,
                        total_carbon=total_carbon,
                        sustainability_score=sustainability_score,
                        tradeoffs=tradeoffs,
                    )
                )

        return alternatives

    def _calculate_design_score(
        self, selections: Dict[str, str], total_cost: float, total_carbon: float
    ) -> float:
        """Calculate overall design sustainability score"""

        # Get material scores
        material_scores = []
        for mat_id in selections.values():
            if mat_id in self.material_db.materials:
                mat = self.material_db.materials[mat_id]
                material_scores.append(self.material_db._calculate_sustainability_score(mat))

        avg_material_score = np.mean(material_scores) if material_scores else 0

        # Normalize cost and carbon (lower is better)
        # Assuming typical values for normalization
        cost_score = max(0, 100 - (total_cost / 1000))  # Normalize to $1000/m2
        carbon_score = max(0, 100 - (total_carbon * 10))  # Normalize

        # Weighted score
        return avg_material_score * 0.5 + cost_score * 0.25 + carbon_score * 0.25

    def _calculate_tradeoffs(
        self, selections: Dict[str, str], candidate_materials: Dict[str, List]
    ) -> Dict[str, float]:
        """Calculate tradeoffs between alternatives"""

        tradeoffs = {}

        for component, mat_id in selections.items():
            if component in candidate_materials and candidate_materials[component]:
                current_mat = None
                for mat in candidate_materials[component]:
                    if mat.id == mat_id:
                        current_mat = mat
                        break

                if current_mat:
                    # Compare with average of alternatives
                    alt_carbons = [
                        m.lca_results.get("embodied_carbon", 0)
                        for m in candidate_materials[component]
                    ]
                    alt_costs = [
                        m.cost_per_unit for m in candidate_materials[component]
                    ]

                    avg_carbon = np.mean(alt_carbons)
                    avg_cost = np.mean(alt_costs)

                    current_carbon = current_mat.lca_results.get("embodied_carbon", 0)
                    current_cost = current_mat.cost_per_unit

                    carbon_savings = ((avg_carbon - current_carbon) / avg_carbon) * 100
                    cost_premium = ((current_cost - avg_cost) / avg_cost) * 100

                    tradeoffs[component] = {
                        "carbon_savings": carbon_savings,
                        "cost_premium": cost_premium,
                        "value_ratio": abs(
                            carbon_savings / (cost_premium + 0.01)
                        ),  # Avoid division by zero
                    }

        return tradeoffs

    def generate_recommendations(
        self, current_design: Dict, target_reduction: float
    ) -> Dict:
        """
        Generate material swap recommendations to achieve carbon reduction target

        Args:
            current_design: Current material selections
            target_reduction: Target carbon reduction percentage
        """

        current_carbon = self._calculate_total_carbon(current_design)
        target_carbon = current_carbon * (1 - target_reduction / 100)

        recommendations = []

        for component, current_mat_id in current_design.items():
            if current_mat_id in self.material_db.materials:
                current_mat = self.material_db.materials[current_mat_id]

                # Find lower carbon alternatives
                alternatives = self.material_db.search_materials(
                    {
                        "category": current_mat.category,
                        "max_carbon": current_mat.lca_results.get("embodied_carbon", 0)
                        * 0.9,  # At least 10% better
                    }
                )

                for alt in alternatives[:3]:  # Top 3 alternatives
                    if alt.id != current_mat_id:
                        carbon_saving = (
                            current_mat.lca_results.get("embodied_carbon", 0)
                            - alt.lca_results.get("embodied_carbon", 0)
                        )

                        cost_difference = alt.cost_per_unit - current_mat.cost_per_unit

                        recommendations.append(
                            {
                                "component": component,
                                "current_material": current_mat.name,
                                "alternative_material": alt.name,
                                "carbon_saving_percent": (
                                    carbon_saving
                                    / current_mat.lca_results.get("embodied_carbon", 1)
                                    * 100
                                ),
                                "cost_impact_percent": (
                                    cost_difference / current_mat.cost_per_unit * 100
                                ),
                                "payback_period": self._calculate_payback_period(
                                    carbon_saving, cost_difference
                                ),
                            }
                        )

        # Sort by carbon savings
        recommendations.sort(
            key=lambda x: x["carbon_saving_percent"], reverse=True
        )

        return {
            "current_carbon": current_carbon,
            "target_carbon": target_carbon,
            "recommendations": recommendations,
            "achievable_reduction": self._calculate_achievable_reduction(
                recommendations, current_carbon
            ),
        }

    def _calculate_total_carbon(self, design: Dict) -> float:
        """Calculate total carbon for a design"""
        total = 0
        for mat_id in design.values():
            if mat_id in self.material_db.materials:
                mat = self.material_db.materials[mat_id]
                total += mat.lca_results.get("embodied_carbon", 0)
        return total

    def _calculate_payback_period(
        self, carbon_saving: float, cost_difference: float
    ) -> Optional[float]:
        """Calculate carbon price payback period"""
        if cost_difference <= 0:
            return 0  # Immediate payback if cheaper

        # Assuming carbon price of $50/ton CO2e
        carbon_price = 50  # $/ton
        annual_savings = carbon_saving * carbon_price / 1000  # Convert kg to tons

        if annual_savings > 0:
            return cost_difference / annual_savings
        return None

    def _calculate_achievable_reduction(
        self, recommendations: List[Dict], current_carbon: float
    ) -> float:
        """Calculate total achievable carbon reduction"""
        if not recommendations:
            return 0

        # Take top recommendations that provide most savings
        total_saving = 0
        for rec in recommendations[:5]:  # Top 5 swaps
            total_saving += rec["carbon_saving_percent"]

        return min(total_saving, 80)  # Cap at 80% reduction
