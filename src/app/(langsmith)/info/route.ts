

export async function GET(request: Request) {
    return Response.json({
        "version": "0.7.5",
        "license_expiration_time": null,
        "batch_ingest_config": {
            "scale_up_qsize_trigger": 1000,
            "scale_up_nthreads_limit": 16,
            "scale_down_nempty_trigger": 4,
            "size_limit": 100,
            "size_limit_bytes": 20971520
        },
        "instance_flags": {
            "generate_ai_query_enabled": true,
            "org_creation_disabled": false,
            "show_ttl_ui": true,
            "trace_tier_duration_days": {
                "longlived": 400,
                "shortlived": 14
            },
            "search_enabled": true,
            "workspace_scope_org_invites": false,
            "s3_storage_enabled": true
        }
    }, {
        headers: {},
        status: 220
    })
}