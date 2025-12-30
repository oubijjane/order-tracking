package com.verAuto.orderTracking.enums;

public enum OrderStatus {
    PENDING("En attente"),
    IN_PROGRESS("En cours"),
    AVAILABLE("Disponible"),
    NOT_AVAILABLE("Non Disponible"),
    SENT("Envoyer"),
    CANCELLED("Annulé"),
    REPAIRED("Réparé");

    private final String label;

    OrderStatus(String label) {
        this.label = label;
    }

    // This getter allows you to grab the French text whenever you need it
    public String getLabel() {
        return label;
    }
}
