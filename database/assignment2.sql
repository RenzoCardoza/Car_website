-- First Task 
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Second Task 
UPDATE public.account SET account_type='Admin' WHERE account_firstname='Tony';

-- Third Task
DELETE FROM public.account WHERE account_firstname='Tony';

-- Forth Task 
UPDATE public.inventory SET inv_description=REPLACE(inv_description,'small interiors','huge interior')
WHERE inv_model='Hummer';

--Fifth Task
SELECT 
	inv_make, inv_model, classification_name, inventory.classification_id
FROM 
	public.classification
INNER JOIN public.inventory 
	ON 
		inventory.classification_id=2 AND classification.classification_name='Sport';

UPDATE public.inventory 
SET 
	inv_image=REPLACE(inv_image, 'images/', 'images/vehicles/'), 
	inv_thumbnail=REPLACE(inv_image, 'images/', 'images/vehicles/');
