// ChoosePlanPage.tsx
import React from 'react';
type PlanId = 'basic' | 'freelancer' | 'business'; // Définir les valeurs possibles pour planId

interface ChoosePlanProps {
    onSelectPlan: (planId: PlanId) => void;
}

const ChoosePlanPage: React.FC<ChoosePlanProps> = ({ onSelectPlan }) => {
    const handlePlanSelection = (planId: PlanId) => {
        onSelectPlan(planId);
    };

    return (
        <div>
            <h2>Sélectionner un plan</h2>
            {/* Ajoutez des boutons ou des éléments pour sélectionner le plan */}
            <button onClick={() => handlePlanSelection('basic')}>Basic</button>
            <button onClick={() => handlePlanSelection('freelancer')}>Freelancer</button>
            <button onClick={() => handlePlanSelection('business')}>Business</button>
        </div>
    );
};

export default ChoosePlanPage;
