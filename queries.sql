CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    referral_code VARCHAR(50) NOT NULL,
    total_donations NUMERIC DEFAULT 0 NOT NULL
);
INSERT INTO users (name, referral_code, total_donations) VALUES
('Deb Kumar', 'debkumar2025', 3500),
('Anjali Verma', 'anjaliv2025', 4200),
('Rohit Roy', 'rohitroy2025', 1800),
('Sneha Gupta', 'snehag2025', 5100),
('Arjun Mehta', 'arjunm2025', 3000),
('Kriti Sharma', 'kritis2025', 2750),
('Manav Singh', 'manavs2025', 4600),
('Pooja Rani', 'poojar2025', 3900),
('Aman Khan', 'amank2025', 2400),
('Nisha Das', 'nishad2025', 5200),
('Kunal Patel', 'kunalp2025', 4300),
('Divya Nair', 'divyan2025', 3100),
('Ravi Yadav', 'raviy2025', 1700),
('Sakshi Malik', 'sakshim2025', 4800),
('Ishaan Roy', 'ishaanr2025', 2950),
('Megha Joshi', 'meghaj2025', 3700),
('Tarun Das', 'tarund2025', 3300),
('Aarti Singh', 'aartis2025', 4100),
('Neeraj Pandey', 'neerajp2025', 2600),
('Simran Kaur', 'simrank2025', 4450);

CREATE TABLE credentials (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

INSERT INTO credentials (user_id, email, password) VALUES
(1, 'debkumar@example.com', 'passDeb2025!'),
(2, 'anjaliv@example.com', 'passAnjali2025!'),
(3, 'rohitroy@example.com', 'passRohit2025!'),
(4, 'snehag@example.com', 'passSneha2025!'),
(5, 'arjunm@example.com', 'passArjun2025!'),
(6, 'kritis@example.com', 'passKriti2025!'),
(7, 'manavs@example.com', 'passManav2025!'),
(8, 'poojar@example.com', 'passPooja2025!'),
(9, 'amank@example.com', 'passAman2025!'),
(10, 'nishad@example.com', 'passNisha2025!'),
(11, 'kunalp@example.com', 'passKunal2025!'),
(12, 'divyan@example.com', 'passDivya2025!'),
(13, 'raviy@example.com', 'passRavi2025!'),
(14, 'sakshim@example.com', 'passSakshi2025!'),
(15, 'ishaanr@example.com', 'passIshaan2025!'),
(16, 'meghaj@example.com', 'passMegha2025!'),
(17, 'tarund@example.com', 'passTarun2025!'),
(18, 'aartis@example.com', 'passAarti2025!'),
(19, 'neerajp@example.com', 'passNeeraj2025!'),
(20, 'simrank@example.com', 'passSimran2025!');

