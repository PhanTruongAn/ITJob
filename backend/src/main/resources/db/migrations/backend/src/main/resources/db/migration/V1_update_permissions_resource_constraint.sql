-- Update permissions.resource CHECK constraint
-- Add newly introduced ResourceEnum values.

ALTER TABLE permissions
DROP CONSTRAINT IF EXISTS permissions_resource_check;

ALTER TABLE permissions
ADD CONSTRAINT permissions_resource_check
CHECK (
    resource::text = ANY (
        ARRAY[
            'JOB'::text,
            'RESUME'::text,
            'COMPANY'::text,
            'APPLICATION'::text,
            'JOB_SAVED'::text,
            'COMPANY_SAVED'::text,
            'COMPANY_REVIEW'::text,
            'NOTIFICATION'::text,
            'USER'::text,
            'ROLE'::text,
            'PERMISSION'::text,
            'DASHBOARD'::text,
            'STATISTICS'::text,
            'REPORT'::text,
            'SUBSCRIBER'::text,
            'SKILL'::text,
            'COUNTRY'::text,
            'RECOMMENDATION'::text,
            'COMPANY_FOLLOW'::text,
            'CANDIDATE_RECOMMENDATION'::text,
            'CANDIDATE_CV'::text
        ]
    )
);