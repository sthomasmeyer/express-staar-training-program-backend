\echo 'Delete and re-create the STAAR-training-program database?'
\prompt 'Return to continue or control-C to cancel this operation > ' foo

DROP DATABASE staar_training_program;
CREATE DATABASE staar_training_program;
\connect staar_training_program

\i db-alt-structure.sql
\i db-seed.sql

\echo 'Delete and re-create the test database for the STAAR-training-program?'
\prompt 'Return to continue or control-C to cancel this operation > ' foo

DROP DATABASE staar_training_program_test;
CREATE DATABASE staar_training_program_test;
\connect staar_training_program_test

\i db-alt-structure.sql
\i db-seed.sql
