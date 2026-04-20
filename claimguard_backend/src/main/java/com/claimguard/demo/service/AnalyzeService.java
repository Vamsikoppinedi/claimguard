package com.claimguard.demo.service;

import com.claimguard.demo.dto.AnalyzeResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AnalyzeService {

    public AnalyzeResponse analyze(String note) {

        String text = note.toLowerCase();

        List<String> missing = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();
        int score = 0;

        // 🔹 Document Checks

        if (!text.contains("chief complaint")) {
            missing.add("Chief Complaint");
            suggestions.add("Add reason for visit");
            score += 2;
        }

        if (!text.contains("hpi")) {
            missing.add("HPI");
            suggestions.add("Add history of present illness");
            score += 2;
        }

        if (!text.contains("exam")) {
            missing.add("Physical Exam");
            suggestions.add("Add exam findings");
            score += 2;
        }

        if (!text.contains("assessment")) {
            missing.add("Assessment");
            suggestions.add("Add diagnosis/impression");
            score += 2;
        }

        if (!text.contains("plan")) {
            missing.add("Plan");
            suggestions.add("Add treatment plan");
            score += 2;
        }

        // 🔹 Completeness %
        int maxScore = 15;
        int completeness = ((maxScore - score) * 100) / maxScore;

        // 🔹 Revenue Impact
        String revenueImpact;
        if (score >= 8) {
            revenueImpact = "$100–$300 per claim";
        } else if (score >= 4) {
            revenueImpact = "$50–$150 per claim";
        } else {
            revenueImpact = "$0–$50 per claim";
        }

        // 🔹 Risk
        String risk;
        if (score >= 8) risk = "HIGH";
        else if (score >= 4) risk = "MEDIUM";
        else risk = "LOW";

        // 🔥 NEW: Pre-Adjudication Checks

        boolean eligible = text.contains("insured");

boolean validProvider =
        text.contains("doctor") ||
        text.contains("provider") ||
        text.contains("physician");

boolean validCodes =
        text.contains("icd") ||
        text.contains("cpt") ||
        text.contains("code");

        // 🔥 NEW: Final Decision (Adjudication)

        String finalDecision;

        if (!eligible || !validProvider || !validCodes) {
            finalDecision = "REJECTED (Pre-Adjudication)";
        } else if (risk.equals("HIGH")) {
            finalDecision = "DENIED";
        } else if (risk.equals("MEDIUM")) {
            finalDecision = "PARTIAL APPROVAL";
        } else {
            finalDecision = "APPROVED";
        }

        // 🔹 Build Response

        AnalyzeResponse response = new AnalyzeResponse(risk, score, missing, suggestions);

        response.setCompleteness(completeness);
        response.setRevenueImpact(revenueImpact);

        // 🔥 NEW fields
        response.eligible = eligible;
        response.validProvider = validProvider;
        response.validCodes = validCodes;
        response.finalDecision = finalDecision;

        return response;
    }
}