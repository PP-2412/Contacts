# Tria Contact List App
A modern, elegant contact manager built with React for the Tria Assignment. Easily add, search, validate, and manage contacts with country code support and a beautiful responsive UI.

## Features
1. Add contacts with validated phone numbers (including country code), with automatic sorting prioritizing numbers starting with digits followed by alphabetical order.
2. Search contacts instantly by name, phone number, or email with case-insensitive, partial matches.
3. Modern, responsive UI with gradient cards, smooth shadows, large readable text, and mobile-friendly layout.
4. Animated contact entries with smooth transitions for adding and deleting.
5. Accessibility considerations including large touch targets, high color contrast, keyboard navigability.

## Architecture and Design
1. Built with React using functional components and hooks (useState, useEffect, useCallback).
2. Contacts are managed in React local state with simulated fetching/loading delay for UX realism.
3. Contact form includes client-side validation for name, phone format, and optional email.
4. Sorting logic ensures digits-first then alphabetical order, case insensitive.
5. Uses lucide-react icon library for UI icons.
6. Styling with vanilla CSS featuring CSS variables, Google Fonts ("Inter"), gradients, and box shadows for an elegant look.
7. Responsive design adapts to mobile screens with CSS media queries.
8. Animations for contact add/delete provide a smooth user experience.

## Deployment
The app is deployed live at: https://contacts-sepia-seven.vercel.app/

## Assumptions
1. Contacts are stored in-memory and not persisted beyond page reload (no backend).
2. Phone validation is simplistic, focusing on length and character format; can be extended with advanced libraries.
3. Only a selected set of country codes and phone validation rules are implemented, easily extendable.

## Libraries & Tools Used
1. React (Create React App)
2. React Hooks (state and lifecycle)
3. Lucide-react for icons
4. Google Fonts (Inter)
5. Vanilla CSS for custom styles and responsive design
6. No third-party form or validation libraries used for demonstration purposes

## Future Improvements
1. Backend integration for persistent contact storage (database)
2. Unit and integration tests to ensure reliability
3. Editable contacts to update existing entries
4. Advanced international phone validation using libraries such as libphonenumber-js
5. Avatar image generation or user-uploaded profile pictures

## Author
Developed by Parth Patel for the Tria assignment, October 2025.
