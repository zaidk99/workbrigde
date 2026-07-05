CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Table
CREATE TYPE user_role AS ENUM('admin' , 'employee' , 'client') ;

CREATE TABLE IF NOT EXISTS users(
    id  UUID  PRIMARY KEY DEFAULT gen_random_uuid(),    
    name VARCHAR(100) NOT NULL,  
    email VARCHAR(255) NOT NULL UNIQUE, 
    password TEXT NOT NULL, 
    role user_role NOT NULL,  
    is_active BOOLEAN NOT NULL DEFAULT TRUE,  
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- client profile table 
CREATE TABLE IF NOT EXISTS client_profiles(
    client_user_id  UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE ,
    company_name VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    company_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- service-request table
CREATE TYPE service_request_status AS ENUM('pending','accepted','rejected');
CREATE TABLE IF NOT EXISTS service_requests(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status service_request_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- project table
CREATE TYPE project_status AS ENUM('inprogress','completed');

CREATE TABLE IF NOT EXISTS projects(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    client_user_id UUID NOT NULL REFERENCES users(id) ON DELETE NO ACTION,
    service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE NO ACTION,
    status project_status NOT NULL DEFAULT 'inprogress',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- project files table  -- schema chages needed for project file uploads 
CREATE TABLE IF NOT EXISTS project_files(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url  TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- project employees table
CREATE TABLE IF NOT EXISTS project_employees(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (project_id,employee_id)
);

-- Message Table 
CREATE TABLE IF NOT EXISTS messages(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE NO ACTION,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE NO ACTION,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_client ON service_requests(client_user_id);

CREATE INDEX idx_projects_client ON projects(client_user_id);

CREATE INDEX idx_projects_service_request ON projects(service_request_id);

CREATE INDEX IF NOT EXISTS idx_project_employees_employee ON project_employees(employee_id);

CREATE INDEX idx_messages_sender ON messages(sender_id);

CREATE INDEX idx_messages_receiver ON messages(receiver_id);