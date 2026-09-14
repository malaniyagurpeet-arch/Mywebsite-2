export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });

    }


    try {

        let body = req.body;

        if (typeof body === "string") {
            body = JSON.parse(body);
        }


        const {
            name,
            email,
            company,
            website,
            service,
            message
        } = body;


        if (!name || !email || !service || !message) {

            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });

        }


        const response = await fetch(
            `${process.env.SUPABASE_URL}/rest/v1/leads`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "apikey": process.env.SUPABASE_SECRET_KEY,
                    "Prefer": "return=minimal"
                },

                body: JSON.stringify({

                    name: name.trim(),

                    email: email.trim(),

                    company: company?.trim() || null,

                    website: website?.trim() || null,

                    service: service.trim(),

                    message: message.trim(),

                    status: "New"

                })
            }
        );


        if (!response.ok) {

            const errorText = await response.text();

            console.error(errorText);

            return res.status(500).json({
                success: false,
                message: "Unable to save lead."
            });

        }


        return res.status(200).json({
            success: true,
            message: "Your request has been received."
        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong."
        });

    }

}