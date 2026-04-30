package com.claimguard.demo.dto;

import java.util.List;

public class AnalyzeResponse {

    public String risk;
    public int score;
    public List<String> missing;
    public List<String> suggestions;

    private int completeness;
    private String revenueImpact;

    // NEW fields
    public boolean eligible;
    public boolean validProvider;
    public boolean validCodes;
    public String finalDecision;

    public AnalyzeResponse(String risk, int score, List<String> missing, List<String> suggestions) {
        this.risk = risk;
        this.score = score;
        this.missing = missing;
        this.suggestions = suggestions;
    }

    public int getCompleteness() {
        return completeness;
    }

    public void setCompleteness(int completeness) {
        this.completeness = completeness;
    }

    public String getRevenueImpact() {
        return revenueImpact;
    }

    public void setRevenueImpact(String revenueImpact) {
        this.revenueImpact = revenueImpact;
    }
}