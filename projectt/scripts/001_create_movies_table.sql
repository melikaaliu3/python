-- Create movies table for the Movies Management System
CREATE TABLE IF NOT EXISTS movies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_year INTEGER,
    genre VARCHAR(100),
    director VARCHAR(255),
    rating DECIMAL(3, 1) CHECK (rating >= 0 AND rating <= 10),
    poster_url TEXT,
    duration_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title);
CREATE INDEX IF NOT EXISTS idx_movies_genre ON movies(genre);
CREATE INDEX IF NOT EXISTS idx_movies_release_year ON movies(release_year);

-- Insert some sample movies
INSERT INTO movies (title, description, release_year, genre, director, rating, duration_minutes) VALUES
('The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 1994, 'Drama', 'Frank Darabont', 9.3, 142),
('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 1972, 'Crime', 'Francis Ford Coppola', 9.2, 175),
('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 2008, 'Action', 'Christopher Nolan', 9.0, 152),
('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 1994, 'Crime', 'Quentin Tarantino', 8.9, 154),
('Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 2010, 'Sci-Fi', 'Christopher Nolan', 8.8, 148),
('The Matrix', 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', 1999, 'Sci-Fi', 'The Wachowskis', 8.7, 136),
('Forrest Gump', 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.', 1994, 'Drama', 'Robert Zemeckis', 8.8, 142),
('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanitys survival.', 2014, 'Sci-Fi', 'Christopher Nolan', 8.6, 169);
