package com.claimguard.demo.dto;

import java.util.List;

public class AnalyzeResponse {

    private String risk;
    private int score;
    private List<String> missing_elements;
    private List<String> suggestions;
    private int completeness;
    private String revenueImpact;
    public boolean eligible;
public boolean validProvider;
public boolean validCodes;
public String finalDecision;

    public AnalyzeResponse(String risk, int score, List<String> missing_elements, List<String> suggestions) {
        this.risk = risk;
        this.score = score;
        this.missing_elements = missing_elements;
        this.suggestions = suggestions;
    }

    public String getRisk() {
        return risk;
    }

    public int getScore() {
        return score;
    }

    public List<String> getMissing_elements() {
        return missing_elements;
    }

    public List<String> getSuggestions() {
        return suggestions;
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