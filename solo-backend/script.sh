# 1. Inject the Relational Schema for Enrollments
cat << 'EOF' > src/api/enrollment/content-types/enrollment/schema.json
{
  "kind": "collectionType",
  "collectionName": "enrollments",
  "info": {
    "singularName": "enrollment",
    "pluralName": "enrollments",
    "displayName": "Enrollment"
  },
  "options": { "draftAndPublish": false },
  "attributes": {
    "enrollment_date": { "type": "datetime" },
    "status": { "type": "string" },
    "user": { "type": "relation", "relation": "manyToOne", "target": "plugin::users-permissions.user" },
    "course": { "type": "relation", "relation": "manyToOne", "target": "api::course.course" }
  }
}
EOF

# 2. Inject the Relational Schema for Progress Tracking
cat << 'EOF' > src/api/progress-tracking/content-types/progress-tracking/schema.json
{
  "kind": "collectionType",
  "collectionName": "progress_trackings",
  "info": {
    "singularName": "progress-tracking",
    "pluralName": "progress-trackings",
    "displayName": "Progress Tracking"
  },
  "options": { "draftAndPublish": false },
  "attributes": {
    "status": { "type": "string" },
    "score": { "type": "integer" },
    "time_spent": { "type": "integer" },
    "user": { "type": "relation", "relation": "manyToOne", "target": "plugin::users-permissions.user" },
    "module": { "type": "relation", "relation": "manyToOne", "target": "api::module.module" }
  }
}
EOF
