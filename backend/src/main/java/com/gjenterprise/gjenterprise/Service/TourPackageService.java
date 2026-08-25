package com.gjenterprise.gjenterprise.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gjenterprise.gjenterprise.Entity.TourPackage;
import com.gjenterprise.gjenterprise.Repository.TourPackageRepository;

@Service
public class TourPackageService {

    private final TourPackageRepository tourPackageRepository;

    public TourPackageService(TourPackageRepository tourPackageRepository) {
        this.tourPackageRepository = tourPackageRepository;
    }

    // Create a new tour package
    public TourPackage createPackage(TourPackage tourPackage) {
        return tourPackageRepository.save(tourPackage);
    }

    // Get all tour packages
    public List<TourPackage> getAllPackages() {
        List<TourPackage> list = tourPackageRepository.findAll();
        boolean hasAndaman = list.stream().anyMatch(p -> "Andaman".equalsIgnoreCase(p.getDestination()));
        boolean hasSingapore = list.stream().anyMatch(p -> "Singapore".equalsIgnoreCase(p.getDestination()));

        if (!hasAndaman) {
            TourPackage andaman = new TourPackage();
            andaman.setDestination("Andaman");
            andaman.setTitle("Andaman & Havelock Island");
            andaman.setDescription("Crystal-clear turquoise waters, Radhanagar Beach sunsets, scuba diving, and private luxury island resort.");
            andaman.setDuration("5 Days / 4 Nights");
            andaman.setPrice(new java.math.BigDecimal("21999"));
            andaman.setImageUrl("https://images.unsplash.com/photo-1589330273594-fade1ee91647?auto=format&fit=crop&w=800&q=80");
            andaman.setCategory("Beach");
            andaman.setDiscountPercentage(20);
            andaman.setRating(4.9);
            andaman.setReviewsCount(190);
            andaman.setIsFeatured(true);
            andaman.setIsActive(true);
            andaman.setInclusions("4-Star Beach Resort, Daily Breakfast & Dinner, Private AC Cab, Ferry Tickets, Scuba Gear");
            andaman.setItinerary("Day 1: Arrival Port Blair, Cellular Jail Light & Sound | Day 2: Luxury Speedboat Ferry to Havelock Swaraj Dweep | Day 3: Radhanagar Beach sunset walk | Day 4: Elephant Beach watersports & Port Blair return | Day 5: Airport drop");
            tourPackageRepository.save(andaman);
        }

        if (!hasSingapore) {
            TourPackage singapore = new TourPackage();
            singapore.setDestination("Singapore");
            singapore.setTitle("Singapore & Sentosa Island");
            singapore.setDescription("Universal Studios, Marina Bay Sands SkyPark, Gardens by the Bay, Night Safari, and Sentosa cable car.");
            singapore.setDuration("5 Days / 4 Nights");
            singapore.setPrice(new java.math.BigDecimal("48999"));
            singapore.setImageUrl("https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80");
            singapore.setCategory("International");
            singapore.setDiscountPercentage(15);
            singapore.setRating(4.9);
            singapore.setReviewsCount(310);
            singapore.setIsFeatured(true);
            singapore.setIsActive(true);
            singapore.setInclusions("4-Star City Hotel, Universal Studios Pass, Sentosa Cable Car, Gardens by the Bay Entry, Private Changi Airport Transfers");
            singapore.setItinerary("Day 1: Arrival at Changi Airport, hotel check-in. Evening Night Safari | Day 2: Singapore City Tour, Marina Bay Sands & Gardens by the Bay | Day 3: Full-Day Universal Studios Singapore | Day 4: Sentosa Island Cable Car & Wings of Time | Day 5: Jewel Changi & Airport Drop");
            tourPackageRepository.save(singapore);
        }

        return tourPackageRepository.findAll();
    }

    // Get package by ID
    public TourPackage getPackageById(Long id) {
        return tourPackageRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Tour package not found with id: " + id));
    }

    // Update package
    public TourPackage updatePackage(Long id, TourPackage updatedPackage) {

        TourPackage existingPackage = getPackageById(id);

        existingPackage.setTitle(updatedPackage.getTitle());
        existingPackage.setDestination(updatedPackage.getDestination());
        existingPackage.setDescription(updatedPackage.getDescription());
        existingPackage.setDuration(updatedPackage.getDuration());
        existingPackage.setPrice(updatedPackage.getPrice());
        existingPackage.setAvailableDate(updatedPackage.getAvailableDate());
        existingPackage.setImageUrl(updatedPackage.getImageUrl());
        existingPackage.setCategory(updatedPackage.getCategory());
        existingPackage.setItinerary(updatedPackage.getItinerary());
        existingPackage.setDiscountPercentage(updatedPackage.getDiscountPercentage());
        existingPackage.setRating(updatedPackage.getRating() != null ? updatedPackage.getRating() : existingPackage.getRating());
        existingPackage.setReviewsCount(updatedPackage.getReviewsCount() != null ? updatedPackage.getReviewsCount() : existingPackage.getReviewsCount());
        existingPackage.setIsFeatured(updatedPackage.getIsFeatured() != null ? updatedPackage.getIsFeatured() : existingPackage.getIsFeatured());
        existingPackage.setIsActive(updatedPackage.getIsActive() != null ? updatedPackage.getIsActive() : existingPackage.getIsActive());
        existingPackage.setInclusions(updatedPackage.getInclusions());
        existingPackage.setExclusions(updatedPackage.getExclusions());

        return tourPackageRepository.save(existingPackage);
    }

    // Delete package
    public void deletePackage(Long id) {

        if (!tourPackageRepository.existsById(id)) {
            throw new RuntimeException(
                    "Tour package not found with id: " + id);
        }

        tourPackageRepository.deleteById(id);
    }
}