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

        int present = 0;
        int total = 5;

        // ✅ Document Checks

        if (text.contains("chief complaint")) {
            present++;
        } else {
            missing.add("Chief Complaint");
            suggestions.add("Add reason for visit");
        }

        if (text.contains("hpi")) {
            present++;
        } else {
            missing.add("HPI");
            suggestions.add("Add history of present illness");
        }

        if (text.contains("exam")) {
            present++;
        } else {
            missing.add("Physical Exam");
            suggestions.add("Add exam findings");
        }

        if (
                text.contains("assessment") ||
                text.contains("diagnosis") ||
                text.contains("impression")
        ) {
            present++;
        } else {
            missing.add("Assessment");
            suggestions.add("Add diagnosis/impression");
        }

        if (text.contains("plan") || text.contains("treatment")) {
            present++;
        } else {
            missing.add("Plan");
            suggestions.add("Add treatment plan");
        }

        // ✅ Completeness
        int completeness = (present * 100) / total;

        // ✅ Score
        int score = total - present;

        // ✅ Revenue Impact
        String revenueImpact;
        if (score >= 3) {
            revenueImpact = "$100–$300 per claim";
        } else if (score >= 1) {
            revenueImpact = "$50–$150 per claim";
        } else {
            revenueImpact = "$0–$50 per claim";
        }

        // ✅ Risk
        String risk;
if (present <= 1) {
    risk = "HIGH";
} else if (present <= 3) {
    risk = "MEDIUM";
} else {
    risk = "LOW";
}

        // ✅ Pre-checks
        boolean eligible = text.contains("insured")||
        text.contains("covered")||
        text.contains("insurance");

        boolean validProvider =
                text.contains("doctor") ||
                text.contains("provider") ||
                text.contains("physician")||
                text.contains("exam")||
                text.contains("evaluated")
                ;

        boolean validCodes =
                text.contains("icd") ||
                text.contains("cpt") ||
                text.contains("code") ||
                text.contains("diagnosis");

        // ✅ Final Decision
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

        // ✅ Response
        AnalyzeResponse response = new AnalyzeResponse(risk, score, missing, suggestions);

        response.setCompleteness(completeness);
        response.setRevenueImpact(revenueImpact);

        response.eligible = eligible;
        response.validProvider = validProvider;
        response.validCodes = validCodes;
        response.finalDecision = finalDecision;

        return response;
    }
}