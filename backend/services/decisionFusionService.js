const decisionFusionService =  ({ aiDecision, strategyDecision, strategyVotes }) => {
    let finalDecision = strategyDecision;
    let fusionReason = [];
    const safeAiDecision = aiDecision || {};
    strategyVotes = {
        BUY: Number(strategyVotes?.BUY || 0),
        SELL: Number(strategyVotes?.SELL || 0),
        HOLD: Number(strategyVotes?.HOLD || 0)
    };
    const aiConfidence = Number(safeAiDecision.confidence || 0);
    let aiAgrees = safeAiDecision.decision === strategyDecision;


    const totalVotes = strategyVotes.BUY + strategyVotes.SELL + strategyVotes.HOLD;
    let strategyConfidence = 0;

    if (totalVotes > 0 && strategyDecision === "BUY")
    {
        strategyConfidence = (strategyVotes.BUY / totalVotes) * 100;
    }

    if (totalVotes > 0 && strategyDecision === "SELL")
    {
        strategyConfidence = (strategyVotes.SELL / totalVotes) * 100;
    }

    if (totalVotes > 0 && strategyDecision === "HOLD")
    {
        strategyConfidence = (strategyVotes.HOLD / totalVotes) * 100;
    }


    if (aiAgrees)
    {
        fusionReason.push("AI Agrees with Strategy Engine");
    }
    else
    {
        fusionReason.push("AI Disagrees with Strategy Engine");
    }


    const finalConfidence = (strategyConfidence + aiConfidence) / 2;
    return {
        strategyDecision,
        strategyVotes,
        aiDecision: safeAiDecision.decision || "HOLD",
        finalDecision,
        aiConfidence,
        strategyConfidence: strategyConfidence.toFixed(2),
        finalConfidence: finalConfidence.toFixed(2),
        aiAgrees,
        fusionReason
    };

};

module.exports = decisionFusionService;
