package vn.phantruongan.backend.util.enums;

public enum CompanyType {
    IT_OUTSOURCING("IT Outsourcing"),
    IT_PRODUCT("IT Product"),
    IT_SERVICE_AND_CONSULTING("IT Service and IT Consulting");

    private final String displayName;

    CompanyType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static CompanyType fromDisplayName(String displayName) {
        for (CompanyType type : CompanyType.values()) {
            if (type.displayName.equalsIgnoreCase(displayName)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown company type: " + displayName);
    }
}
