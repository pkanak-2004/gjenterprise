package com.gjenterprise.gjenterprise.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gjenterprise.gjenterprise.Entity.TourPackage;
import com.gjenterprise.gjenterprise.Service.TourPackageService;

@RestController
@RequestMapping("/api/packages")
public class TourPackageController {

    private final TourPackageService tourPackageService;

    public TourPackageController(TourPackageService tourPackageService) {
        this.tourPackageService = tourPackageService;
    }

    // Create package
    @PostMapping
    public ResponseEntity<TourPackage> createPackage(
            @RequestBody TourPackage tourPackage) {

        TourPackage savedPackage =
                tourPackageService.createPackage(tourPackage);

        return ResponseEntity.ok(savedPackage);
    }

    // Get all packages
    @GetMapping
    public ResponseEntity<List<TourPackage>> getAllPackages() {

        List<TourPackage> packages =
                tourPackageService.getAllPackages();

        return ResponseEntity.ok(packages);
    }

    // Get package by ID
    @GetMapping("/{id}")
    public ResponseEntity<TourPackage> getPackageById(
            @PathVariable Long id) {

        TourPackage tourPackage =
                tourPackageService.getPackageById(id);

        return ResponseEntity.ok(tourPackage);
    }

    // Update package
    @PutMapping("/{id}")
    public ResponseEntity<TourPackage> updatePackage(
            @PathVariable Long id,
            @RequestBody TourPackage tourPackage) {

        TourPackage updatedPackage =
                tourPackageService.updatePackage(id, tourPackage);

        return ResponseEntity.ok(updatedPackage);
    }

    // Delete package
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePackage(
            @PathVariable Long id) {

        tourPackageService.deletePackage(id);

        return ResponseEntity.ok("Tour package deleted successfully");
    }
}