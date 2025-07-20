-- Add more cosmetic production courses
INSERT INTO public.courses (title, description, duration_hours) VALUES
('Skincare Product Development', 'Learn to formulate and produce various skincare products including cleansers, moisturizers, serums, and treatments', 25),
('Makeup Production Mastery', 'Master the art of creating makeup products from foundations and powders to lipsticks and eye makeup', 20),
('Hair Care Product Manufacturing', 'Comprehensive guide to developing shampoos, conditioners, styling products, and hair treatments', 18),
('Fragrance and Perfume Creation', 'Explore the world of fragrance development, from essential oils to complex perfume compositions', 15),
('Natural and Organic Cosmetics', 'Specialize in creating natural, organic, and clean beauty products using sustainable ingredients', 22);

-- Get the course IDs for module creation (we'll use the titles to match)
-- Add modules for Skincare Product Development
INSERT INTO public.modules (course_id, title, description, order_index, content) 
SELECT id, 'Skin Biology and Chemistry', 'Understanding skin types, pH levels, and how different ingredients interact with skin', 1, 
'{"slides": [
  {"type": "content", "title": "Understanding Skin Types", "content": "Learn about different skin types: normal, dry, oily, combination, and sensitive skin. Each type requires specific formulation approaches."},
  {"type": "content", "title": "pH and Skin Health", "content": "The skin has a natural pH of 4.5-5.5. Understanding pH is crucial for creating effective skincare products that maintain skin barrier function."},
  {"type": "content", "title": "Active Ingredients", "content": "Explore key active ingredients: retinoids for anti-aging, salicylic acid for acne, hyaluronic acid for hydration, and vitamin C for antioxidant protection."}
]}'::jsonb
FROM public.courses WHERE title = 'Skincare Product Development';

INSERT INTO public.modules (course_id, title, description, order_index, content) 
SELECT id, 'Cleanser Formulation', 'Creating effective facial cleansers, from gentle cream cleansers to deep-cleansing foams', 2,
'{"slides": [
  {"type": "content", "title": "Surfactant Systems", "content": "Understanding different surfactants: anionic (SLS), cationic, amphoteric, and non-ionic. Each provides different cleansing properties."},
  {"type": "content", "title": "Formulation Basics", "content": "Creating stable cleanser formulations with proper viscosity, pH adjustment, and preservation systems."},
  {"type": "content", "title": "Testing and Quality Control", "content": "Methods for testing cleanser effectiveness, mildness testing, and ensuring product stability over time."}
]}'::jsonb
FROM public.courses WHERE title = 'Skincare Product Development';

INSERT INTO public.modules (course_id, title, description, order_index, content) 
SELECT id, 'Moisturizer Development', 'Formulating creams, lotions, and serums for different skin needs and concerns', 3,
'{"slides": [
  {"type": "content", "title": "Emulsion Science", "content": "Understanding oil-in-water and water-in-oil emulsions. Selecting appropriate emulsifiers for stable formulations."},
  {"type": "content", "title": "Humectants and Occlusives", "content": "Using glycerin, hyaluronic acid (humectants) and petrolatum, ceramides (occlusives) to lock in moisture."},
  {"type": "content", "title": "Anti-Aging Formulations", "content": "Incorporating peptides, retinoids, and antioxidants into moisturizers for anti-aging benefits."}
]}'::jsonb
FROM public.courses WHERE title = 'Skincare Product Development';

-- Add modules for Makeup Production Mastery
INSERT INTO public.modules (course_id, title, description, order_index, content) 
SELECT id, 'Foundation and Concealer Production', 'Creating liquid, powder, and cream foundations with proper coverage and wear', 1,
'{"slides": [
  {"type": "content", "title": "Pigment Technology", "content": "Understanding iron oxides, titanium dioxide, and other colorants used in foundations. Color matching and undertone considerations."},
  {"type": "content", "title": "Texture and Feel", "content": "Creating products with desired finish: matte, dewy, or satin. Controlling oil absorption and longevity."},
  {"type": "content", "title": "Shade Range Development", "content": "Formulating inclusive shade ranges that cater to all skin tones, from fair to deep complexions."}
]}'::jsonb
FROM public.courses WHERE title = 'Makeup Production Mastery';

INSERT INTO public.modules (course_id, title, description, order_index, content) 
SELECT id, 'Lipstick and Lip Product Manufacturing', 'Formulating lipsticks, glosses, and lip balms with color, texture, and longevity', 2,
'{"slides": [
  {"type": "content", "title": "Wax and Oil Systems", "content": "Selecting waxes (carnauba, candelilla) and oils (castor, jojoba) for desired texture and application properties."},
  {"type": "content", "title": "Color Development", "content": "Using lakes, dyes, and pigments to create vibrant, long-lasting lip colors. Understanding color stability."},
  {"type": "content", "title": "Manufacturing Process", "content": "Step-by-step lipstick manufacturing: melting, mixing, molding, and quality control procedures."}
]}'::jsonb
FROM public.courses WHERE title = 'Makeup Production Mastery';

-- Add modules for Hair Care Product Manufacturing
INSERT INTO public.modules (course_id, title, description, order_index, content) 
SELECT id, 'Shampoo Science and Formulation', 'Understanding hair structure and creating effective cleansing systems', 1,
'{"slides": [
  {"type": "content", "title": "Hair Structure and Damage", "content": "Understanding the hair cuticle, cortex, and medulla. How chemical processes and environmental factors damage hair."},
  {"type": "content", "title": "Cleansing Chemistry", "content": "Sulfate vs sulfate-free formulations. Primary and secondary surfactants for effective yet gentle cleansing."},
  {"type": "content", "title": "Specialty Shampoos", "content": "Formulating for specific needs: color-treated hair, dandruff control, volumizing, and clarifying shampoos."}
]}'::jsonb
FROM public.courses WHERE title = 'Hair Care Product Manufacturing';

INSERT INTO public.modules (course_id, title, description, order_index, content) 
SELECT id, 'Conditioner and Treatment Products', 'Creating conditioners, masks, and leave-in treatments for hair repair and protection', 2,
'{"slides": [
  {"type": "content", "title": "Conditioning Agents", "content": "Understanding quaternary ammonium compounds, proteins, and silicones for hair conditioning and repair."},
  {"type": "content", "title": "Deep Treatment Formulations", "content": "Creating intensive hair masks and treatments using ceramides, amino acids, and natural oils."},
  {"type": "content", "title": "Heat Protection and Styling", "content": "Formulating leave-in products that protect against heat damage and provide styling benefits."}
]}'::jsonb
FROM public.courses WHERE title = 'Hair Care Product Manufacturing';

-- Add tests for the new courses
-- Skincare Product Development Test
INSERT INTO public.tests (module_id, title, questions, passing_score)
SELECT m.id, 'Skincare Formulation Assessment', 
'[
  {
    "question": "What is the ideal pH range for most skincare products?",
    "options": ["3.0-4.0", "4.5-5.5", "6.0-7.0", "7.5-8.5"],
    "correct": 1
  },
  {
    "question": "Which ingredient is primarily used for anti-aging benefits?",
    "options": ["Salicylic acid", "Retinol", "Benzoyl peroxide", "Glycolic acid"],
    "correct": 1
  },
  {
    "question": "What type of emulsion is most common in facial moisturizers?",
    "options": ["Water-in-oil", "Oil-in-water", "Water-in-silicone", "Oil-in-silicone"],
    "correct": 1
  },
  {
    "question": "Which surfactant type is considered most gentle?",
    "options": ["Anionic", "Cationic", "Amphoteric", "Non-ionic"],
    "correct": 2
  },
  {
    "question": "What is the primary function of hyaluronic acid in skincare?",
    "options": ["Exfoliation", "Hydration", "Sun protection", "Oil control"],
    "correct": 1
  }
]'::jsonb, 80
FROM public.modules m
JOIN public.courses c ON m.course_id = c.id
WHERE c.title = 'Skincare Product Development' AND m.title = 'Moisturizer Development';

-- Makeup Production Test
INSERT INTO public.tests (module_id, title, questions, passing_score)
SELECT m.id, 'Makeup Manufacturing Knowledge Test', 
'[
  {
    "question": "Which pigment provides the primary coverage in foundations?",
    "options": ["Iron oxides", "Titanium dioxide", "Zinc oxide", "Mica"],
    "correct": 1
  },
  {
    "question": "What wax is commonly used in lipstick formulations?",
    "options": ["Beeswax", "Carnauba wax", "Paraffin wax", "Soy wax"],
    "correct": 1
  },
  {
    "question": "How many shades should a inclusive foundation range ideally have?",
    "options": ["20-30", "30-40", "40-50", "50+"],
    "correct": 3
  },
  {
    "question": "What determines the finish of a foundation (matte vs dewy)?",
    "options": ["Pigment concentration", "Oil content and powders", "pH level", "Fragrance"],
    "correct": 1
  }
]'::jsonb, 75
FROM public.modules m
JOIN public.courses c ON m.course_id = c.id
WHERE c.title = 'Makeup Production Mastery' AND m.title = 'Lipstick and Lip Product Manufacturing';

-- Hair Care Test
INSERT INTO public.tests (module_id, title, questions, passing_score)
SELECT m.id, 'Hair Care Formulation Exam', 
'[
  {
    "question": "What part of the hair shaft is responsible for strength?",
    "options": ["Cuticle", "Cortex", "Medulla", "Root"],
    "correct": 1
  },
  {
    "question": "Which type of conditioner ingredient helps repair damaged hair?",
    "options": ["Silicones", "Proteins", "Sulfates", "Parabens"],
    "correct": 1
  },
  {
    "question": "What is the main difference between sulfate and sulfate-free shampoos?",
    "options": ["Color", "Gentleness", "Price", "Thickness"],
    "correct": 1
  },
  {
    "question": "Which ingredient provides heat protection in styling products?",
    "options": ["Alcohol", "Silicones", "Water", "Glycerin"],
    "correct": 1
  }
]'::jsonb, 75
FROM public.modules m
JOIN public.courses c ON m.course_id = c.id
WHERE c.title = 'Hair Care Product Manufacturing' AND m.title = 'Conditioner and Treatment Products';

-- Add more modules for remaining courses
INSERT INTO public.modules (course_id, title, description, order_index, content) 
SELECT id, 'Fragrance Fundamentals', 'Understanding fragrance notes, blending, and perfume structure', 1,
'{"slides": [
  {"type": "content", "title": "Fragrance Pyramid", "content": "Understanding top, middle, and base notes. How fragrances evolve over time on the skin."},
  {"type": "content", "title": "Essential Oils vs Synthetics", "content": "Natural vs synthetic fragrance ingredients. Benefits and challenges of each approach."},
  {"type": "content", "title": "Blending Techniques", "content": "Methods for creating harmonious fragrance compositions and achieving desired scent profiles."}
]}'::jsonb
FROM public.courses WHERE title = 'Fragrance and Perfume Creation';

INSERT INTO public.modules (course_id, title, description, order_index, content) 
SELECT id, 'Natural Ingredient Sourcing', 'Finding and using natural, organic, and sustainable ingredients', 1,
'{"slides": [
  {"type": "content", "title": "Organic Certification", "content": "Understanding USDA Organic, COSMOS, and other certification standards for natural cosmetics."},
  {"type": "content", "title": "Plant Extracts and Oils", "content": "Working with botanical extracts, carrier oils, and natural preservatives in formulations."},
  {"type": "content", "title": "Sustainability Practices", "content": "Implementing eco-friendly manufacturing processes and sustainable packaging solutions."}
]}'::jsonb
FROM public.courses WHERE title = 'Natural and Organic Cosmetics';