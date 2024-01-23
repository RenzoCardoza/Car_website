-- Data for table `inventory`

INSERT INTO public.inventory (
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
VALUES   (
    'Chevy',
    'Camaro',
    '2018',
    'If you want to look cool this is the ar you need! This car has great performance at an affordable price. Own it today!',
    '/images/camaro.jpg',
    '/images/camaro-tn.jpg',
    25000,
    101222,
    'Silver',
    2
  ), (
    'Batmobile',
    'Custom',
    '2007',
    'Ever want to be a super hero? now you can with the batmobile. This car allows you to switch to bike mode allowing you to easily maneuver through trafic during rush hour.',
    '/images/bat.jpg',
    '/images/bat-tn.jpg',
    65000,
    29887,
    'Black',
    1
  ), (
    'FBI',
    'Surveillance Van',
    '2016',
    'do you like police shows? You will feel right at home driving this van, come complete with survalence equipments for and extra fee of $2,000 a month. ',
    '/images/fbi.jpg',
    '/images/fbi-tn.jpg',
    20000,
    19851,
    'Green',
    1
  ), (
    'Dog ',
    'Car',
    '1997',
    'Do you like dogs? Well this car is for you straight from the 90s from Aspen, Colorado we have the orginal Dog Car complete with fluffy ears.',
    '/images/dog.jpg',
    '/images/dog-tn.jpg',
    35000,
    71632,
    'Brown',
    1
  ), (
    'Jeep',
    'Wrangler',
    '2019',
    'The Jeep Wrangler is small and compact with enough power to get you where you want to go. Its great for everyday driving as well as offroading weather that be on the the rocks or in the mud!',
    '/images/jeep-wrangler.jpg',
    '/images/jeep-wrangler-tn.jpg',
    28045,
    41205,
    'Orange',
    3
  ), (
    'Lamborghini',
    'Adventador',
    '2016',
    'This V-12 engine packs a punch in this sporty car. Make sure you wear your seatbelt and obey all traffic laws. ',
    '/images/lambo-Adve.jpg',
    '/images/lambo-Adve-tn.jpg',
    417650,
    71003,
    'Blue',
    2
  ), (
    'Aerocar International',
    'Aerocar',
    '1963',
    'Are you sick of rushhour trafic? This car converts into an airplane to get you where you are going fast. Only 6 of these were made, get them while they last!',
    '/images/aerocar.jpg',
    '/images/aerocar-tn.jpg',
    700000,
    18956,
    'Red',
    1
  ), (
    'Monster',
    'Truck',
    '1995',
    'Most trucks are for working, this one is for fun. this beast comes with 60in tires giving you tracktions needed to jump and roll in the mud.',
    '/images/monster.jpg',
    '/images/monster-tn.jpg',
    150000,
    3998,
    'purple',
    1
  ), (
    'Cadillac',
    'Escalade',
    '2019',
    'This stylin car is great for any occasion from going to the beach to meeting the president. The luxurious inside makes this car a home away from home.',
    '/images/escalade.jpg',
    '/images/escalade-tn.jpg',
    75195,
    41958,
    'Black',
    4
  ), (
    'GM',
    'Hummer',
    '2016',
    'Do you have 6 kids and like to go offroading? The Hummer gives you the small interiors with an engine to get you out of any muddy or rocky situation.',
    '/images/hummer.jpg',
    '/images/hummer-tn.jpg',
    58800,
    56564,
    'Yellow',
    4
  ), (
    'Mechanic',
    'Special',
    '1964',
    'Not sure where this car came from. however with a little tlc it will run as good a new.',
    '/images/ms.jpg',
    '/images/ms-tn.jpg',
    100,
    200125,
    'Rust',
    5
  ), (
    'Ford',
    'Model T',
    '1921',
    'The Ford Model T can be a bit tricky to drive. It was the first car to be put into production. You can get it in any color you want as long as it is black.',
    '/images/ford-modelt.jpg',
    '/images/ford-modelt-tn.jpg',
    30000,
    26357,
    'Black',
    5
  ), (
    'Mystery',
    'Machine',
    '1999',
    'Scooby and the gang always found luck in solving their mysteries because of there 4 wheel drive Mystery Machine. This Van will help you do whatever job you are required to with a success rate of 100%.',
    '/images/mm.jpg',
    '/images/mm-tn.jpg',
    10000,
    128564,
    'Green',
    1
  ),
  (
    'Spartan',
    'Fire Truck',
    '2012',
    'Emergencies happen often. Be prepared with this Spartan fire truck. Comes complete with 1000 ft. of hose and a 1000 gallon tank.',
    '/images/fire-truck.jpg',
    '/images/fire-truck-tn.jpg',
    50000,
    38522,
    'Red',
    4
  ), (
    'Ford',
    'Crown Victoria',
    '2013',
    'After the police force updated their fleet these cars are now available to the public! These cars come equiped with the siren which is convenient for college students running late to class.',
    '/images/crown-vic.jpg',
    '/images/crown-vic-tn.jpg',
    10000,
    108247,
    'White',
    5
  );
