CREATE TABLE elect_mseat_to_candidate (
  candidate_id INT NOT NULL,
  ballot_id INT NOT NULL
);

CREATE TABLE elect_ballot_to_ticket (
  ballot_id INT NOT NULL,
  ticket_id INT NOT NULL
);

CREATE TABLE elect_option_to_ref (
  referendum_id INT NOT NULL,
  option_id INT NOT NULL
);

CREATE TABLE elect_voter_to_ballot (
  voter_hash varchar(255) NOT NULL,
  ballot_id INT NOT NULL
);

CREATE TABLE elect_voter_to_ref (
  voter_hash varchar(255) NOT NULL,
  referendum_id INT NOT NULL
);