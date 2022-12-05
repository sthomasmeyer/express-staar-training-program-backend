CREATE TABLE schools (
  id serial PRIMARY KEY,
  city text NOT NULL,
  county text NOT NULL,
  district text NOT NULL,
  school_name text NOT NULL
);

CREATE TABLE users (
  id serial PRIMARY KEY,
  email varchar(255) UNIQUE NOT NULL,
  school_id integer REFERENCES schools (id) ON DELETE CASCADE,
  pwd varchar(129) NOT NULL,
  admin_account boolean DEFAULT false
);

CREATE TABLE english_two_modules (
  id serial PRIMARY KEY,
  aligned_standards text[],
  module_name text NOT NULL
);

CREATE TABLE english_two_articles (
  id serial PRIMARY KEY,
  title text UNIQUE NOT NULL,
  author text,
  genre text CHECK (genre IN ('fiction', 'drama', 'poetry', 'literary nonfiction', 'informational', 'argumentative', 'correspondence', 'persuasive')),
  publication_date integer,
  content text NOT NULL,
  context text,
  -- All articles are assigned to a specific module.
  module_id integer REFERENCES english_two_modules (id) ON DELETE CASCADE
);

CREATE TABLE english_two_questions (
  id serial PRIMARY KEY,
  aligned_standards text[],
  -- This CHECK constraint ensures that the 'question_type' column will only contain...
  -- one of five English II question types: 'multi-select', 'multiple-choice', 'two-part', 'text-entry' or 'table-style'
  question_type text CHECK (question_type IN ('multi-select', 'multiple-choice', 'table-style', 'text-entry', 'two-part')),
  -- Yes, the 'question' column is nullable. This is not a mistake. From time to time...
  -- 'text-entry' questions will rely on clear direction(s) in lieu of an actual question.
  question text[],
  answer_choices text[],
  correct_answer text[] NOT NULL,
  -- The 'total_possible_points' column is critical bc it allows for accurate module performance tracking...
  -- even if the active user fails to submit a response for every question in a given module.
  total_possible_points integer NOT NULL DEFAULT 1,
  selected_text text,
  -- The incomplete_statement column only applies to 'text-entry' questions.
  incomplete_statement text,
  -- The 'table-style' question type often incorporates clear direction(s) in addition...
  -- to the question itself. The 'text-entry' question type occasionally drops the...
  -- question entirely in favor of direction(s).
  directions text,
  -- The 'conditions' column only apply to 'table-style' questions.
  conditions text[],
  -- All questions are assigned to a specific module.
  module_id integer REFERENCES english_two_modules (id) ON DELETE CASCADE
);

CREATE TABLE english_two_responses (
  id serial PRIMARY KEY,
  correct_response text[] NOT NULL,
  user_response text[] NOT NULL,
  -- The 'total_points' metric indicates how many points a student can earn, if...
  -- they answer each and every part of the question correctly.
  total_points integer NOT NULL DEFAULT 1,
  points_earned integer NOT NULL DEFAULT 0,
  -- All responses are aligned to specific questions, modules, and users.
  question_id integer REFERENCES english_two_questions (id) ON DELETE CASCADE,
  module_id integer REFERENCES english_two_modules (id) ON DELETE CASCADE,
  user_id integer REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE english_two_module_performance (
  id serial PRIMARY KEY,
  first_attempt decimal NOT NULL,
  best_overall decimal NOT NULL,
  module_id integer REFERENCES english_two_modules (id) ON DELETE CASCADE,
  user_id integer REFERENCES users (id) ON DELETE CASCADE
);
