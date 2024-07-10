// This will store emails in a simple array. For production, you might want to use a database.
// christian@gmail.com
let emails = [];

export default function handler(req, res) {
    switch (req.method) {
        case 'POST':
            // Add a new email to the waitlist
            const { email } = req.body;
            console.log(`Email: ${email}`);
            console.log('Request body:', req.body);
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }
            if (emails.includes(email)) {
                return res.status(409).json({ message: 'Email already on the waitlist' });
            }
            emails.push(email);
            return res.status(200).json({ message: 'Email successfully added to waitlist' });

        case 'GET':
            // Retrieve all emails
            return res.status(200).json(emails);

        case 'DELETE':
            // Clear the waitlist
            emails = [];
            return res.status(200).json({ message: 'Waitlist cleared' });

        default:
            // Method not allowed
            res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
