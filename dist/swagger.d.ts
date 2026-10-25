export declare const swaggerDocument: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
    }[];
    tags: {
        name: string;
    }[];
    components: {
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
            };
        };
        schemas: {
            Task: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    ownerId: {
                        type: string;
                    };
                    title: {
                        type: string;
                    };
                    dueDate: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    completed: {
                        type: string;
                    };
                    important: {
                        type: string;
                    };
                    difficulty: {
                        type: string;
                        nullable: boolean;
                    };
                    label: {
                        type: string;
                        nullable: boolean;
                    };
                };
            };
            TaskInput: {
                type: string;
                required: string[];
                properties: {
                    title: {
                        type: string;
                        example: string;
                    };
                    dueDate: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    completed: {
                        type: string;
                    };
                    important: {
                        type: string;
                    };
                    difficulty: {
                        type: string;
                        nullable: boolean;
                    };
                    label: {
                        type: string;
                        nullable: boolean;
                    };
                };
            };
            TaskUpdate: {
                type: string;
                minProperties: number;
                properties: {
                    title: {
                        type: string;
                        example: string;
                    };
                    dueDate: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    completed: {
                        type: string;
                    };
                    important: {
                        type: string;
                    };
                    difficulty: {
                        type: string;
                        nullable: boolean;
                    };
                    label: {
                        type: string;
                        nullable: boolean;
                    };
                };
            };
            TaskPage: {
                type: string;
                properties: {
                    data: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                    pagination: {
                        type: string;
                        properties: {
                            page: {
                                type: string;
                            };
                            limit: {
                                type: string;
                            };
                            total: {
                                type: string;
                            };
                            totalPages: {
                                type: string;
                            };
                        };
                    };
                };
            };
            Credentials: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                    };
                    password: {
                        type: string;
                        format: string;
                        minLength: number;
                        maxLength: number;
                    };
                };
            };
            AuthResult: {
                type: string;
                properties: {
                    user: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                            };
                            email: {
                                type: string;
                            };
                        };
                    };
                    token: {
                        type: string;
                        description: string;
                    };
                };
            };
            Error: {
                type: string;
                properties: {
                    message: {
                        type: string;
                    };
                };
            };
        };
    };
    paths: {
        "/": {
            get: {
                summary: string;
                responses: {
                    "200": {
                        description: string;
                    };
                };
            };
        };
        "/auth/register": {
            post: {
                tags: string[];
                summary: string;
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: object;
                        };
                    };
                };
                responses: {
                    "201": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "400": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "409": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/auth/login": {
            post: {
                tags: string[];
                summary: string;
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: object;
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "400": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/auth/me": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/tasks": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: ({
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        minimum: number;
                        default: number;
                        maximum?: never;
                        maxLength?: never;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        minimum: number;
                        maximum: number;
                        default: number;
                        maxLength?: never;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        minimum?: never;
                        maximum?: never;
                        default?: never;
                        type: string;
                        maxLength: number;
                    };
                })[];
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "400": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: object;
                        };
                    };
                };
                responses: {
                    "201": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "400": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/tasks/{id}": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        minimum: number;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "400": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "404": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
            patch: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        minimum: number;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: object;
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "400": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "404": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        minimum: number;
                    };
                }[];
                responses: {
                    "204": {
                        description: string;
                    };
                    "400": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "404": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/tasks/labels": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/tasks/today": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: ({
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        minimum: number;
                        default: number;
                        maximum?: never;
                        maxLength?: never;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        minimum: number;
                        maximum: number;
                        default: number;
                        maxLength?: never;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        minimum?: never;
                        maximum?: never;
                        default?: never;
                        type: string;
                        maxLength: number;
                    };
                })[];
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "400": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/tasks/upcoming": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: ({
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        minimum: number;
                        default: number;
                        maximum?: never;
                        maxLength?: never;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        minimum: number;
                        maximum: number;
                        default: number;
                        maxLength?: never;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        minimum?: never;
                        maximum?: never;
                        default?: never;
                        type: string;
                        maxLength: number;
                    };
                })[];
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "400": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/tasks/overdue": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: ({
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        minimum: number;
                        default: number;
                        maximum?: never;
                        maxLength?: never;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        minimum: number;
                        maximum: number;
                        default: number;
                        maxLength?: never;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        minimum?: never;
                        maximum?: never;
                        default?: never;
                        type: string;
                        maxLength: number;
                    };
                })[];
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "400": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/tasks/completed": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: ({
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        minimum: number;
                        default: number;
                        maximum?: never;
                        maxLength?: never;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        minimum: number;
                        maximum: number;
                        default: number;
                        maxLength?: never;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        minimum?: never;
                        maximum?: never;
                        default?: never;
                        type: string;
                        maxLength: number;
                    };
                })[];
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "400": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/tasks/important": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: ({
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        minimum: number;
                        default: number;
                        maximum?: never;
                        maxLength?: never;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        minimum: number;
                        maximum: number;
                        default: number;
                        maxLength?: never;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        minimum?: never;
                        maximum?: never;
                        default?: never;
                        type: string;
                        maxLength: number;
                    };
                })[];
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "400": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=swagger.d.ts.map