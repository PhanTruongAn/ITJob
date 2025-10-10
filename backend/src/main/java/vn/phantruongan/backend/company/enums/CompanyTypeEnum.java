package vn.phantruongan.backend.company.enums;

public enum CompanyTypeEnum {
    IT_OUTSOURCING("IT Outsourcing"),
    IT_PRODUCT("IT Product"),
    IT_SERVICE_AND_CONSULTING("IT Service and IT Consulting");

    private final String displayName;

    CompanyTypeEnum(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static CompanyTypeEnum fromDisplayName(String displayName) {
        for (CompanyTypeEnum type : CompanyTypeEnum.values()) {
            if (type.displayName.equalsIgnoreCase(displayName)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown company type: " + displayName);
    }
}
