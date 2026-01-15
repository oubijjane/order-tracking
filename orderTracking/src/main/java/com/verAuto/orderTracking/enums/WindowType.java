package com.verAuto.orderTracking.enums;

public enum WindowType {
    PARE_BRISE("Pare-brise"),
    DEFLECTEUR_AVANT_GAUCHE("Déflecteur avant gauche"),
    DEFLECTEUR_AVANT_DROITE("Déflecteur avant droite"),
    VITRE_AVANT_GAUCHE("Vitre avant gauche"),
    VITRE_AVANT_DROITE("Vitre avant droite"),
    VITRE_ARRIERE_GAUCHE("Vitre arrière gauche"),
    VITRE_ARRIERE_DROITE("Vitre arrière droite"),
    CUSTAUDE_ARRIERE_GAUCHE("Custode arrière gauche"),
    CUSTAUDE_ARRIERE_DROITE("Custode arrière droite"),
    VITRE_LATERALE_GAUCHE("Vitre latérale gauche"),
    VITRE_LATERALE_DROITE("Vitre latérale droite"),
    LUNETTE_ARRIERE("Lunette arrière"),
    LUNETTE_ARRIERE_GAUCHE("Lunette arrière gauche"),
    LUNETTE_ARRIERE_DROITE("Lunette arrière droite");

    private final String label;

    WindowType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return this.label;
    }
}
