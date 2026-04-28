// ─── RestaurantStatus.java ────────────────────────────────────────────────────
package br.com.app.domain.enums;

public enum RestaurantStatus {
    PENDING_APPROVAL,
    ACTIVE,
    INACTIVE
}


// ─── Address.java (Embeddable) ────────────────────────────────────────────────
package br.com.app.domain.embeddable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    private String street;
    private String number;
    private String complement;
    private String neighborhood;
    private String zipCode;
}


// ─── City.java ────────────────────────────────────────────────────────────────
package br.com.app.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cities")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // Brazilian state code: SP, RS, RJ...
    @Column(name = "state_code", length = 2, nullable = false)
    private String stateCode;

    @Column(unique = true, nullable = false)
    private String slug;
}


// ─── Category.java ────────────────────────────────────────────────────────────
package br.com.app.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String slug;

    private String iconUrl;
}


// ─── BusinessHours.java ───────────────────────────────────────────────────────
package br.com.app.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(
    name = "business_hours",
    uniqueConstraints = @UniqueConstraint(columnNames = {"restaurant_id", "day_of_week"})
)
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessHours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    // Using java.time.DayOfWeek — no need for a custom enum
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private DayOfWeek dayOfWeek;

    private LocalTime openTime;
    private LocalTime closeTime;

    // true = closed on this day; openTime/closeTime are ignored
    @Column(nullable = false)
    @Builder.Default
    private boolean closed = false;
}


// ─── Restaurant.java ──────────────────────────────────────────────────────────
package br.com.app.domain.entity;

import br.com.app.domain.embeddable.Address;
import br.com.app.domain.enums.RestaurantStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "restaurants")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Public identifier: exposed in URLs and external API, never sequential
    @Column(name = "public_id", nullable = false, unique = true, updatable = false)
    @Builder.Default
    private UUID publicId = UUID.randomUUID();

    @Column(nullable = false)
    private String name;

    // Generated from name; decorative in the URL
    @Column(unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RestaurantStatus status = RestaurantStatus.PENDING_APPROVAL;

    // Embedded address: no extra table, no join
    @Embedded
    private Address address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "restaurant_categories",
        joinColumns = @JoinColumn(name = "restaurant_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Builder.Default
    private List<Category> categories = new ArrayList<>();

    // orphanRemoval: removing a BusinessHours from the list deletes it from the DB
    @OneToMany(
        mappedBy = "restaurant",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<BusinessHours> businessHours = new ArrayList<>();

    private String phone;
    private String logoUrl;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}