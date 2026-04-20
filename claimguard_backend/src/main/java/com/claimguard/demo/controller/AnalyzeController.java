package com.claimguard.demo.controller;

import com.claimguard.demo.dto.AnalyzeRequest;
import com.claimguard.demo.dto.AnalyzeResponse;
import com.claimguard.demo.service.AnalyzeService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class AnalyzeController {

    private final AnalyzeService analyzeService;

    public AnalyzeController(AnalyzeService analyzeService) {
        this.analyzeService = analyzeService;
    }

    @PostMapping("/analyze-note")
    public AnalyzeResponse analyze(@RequestBody AnalyzeRequest request) {
        return analyzeService.analyze(request.getNote());
    }
}