import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase URL or Service Key in .env.local");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function setupAdmin() {
    const email = 'info@floripondioayd.com.ar';
    const password = '0303456';

    console.log(`Checking if admin user ${email} exists...`);

    // Try to create the user
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
            first_name: 'Admin',
            last_name: 'Floripondio'
        }
    });

    let userId;

    if (createError) {
        if (createError.message.includes('already exists') || createError.message.includes('A user with this email address has already been registered')) {
            console.log("User already exists. Fetching user id...");
            // Need to fetch user id by email
            // Supabase Admin API to list users (filtered by email is not directly supported, so we list and find)
            const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
            if (listError) {
                console.error("Error fetching user list:", listError);
                process.exit(1);
            }
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                userId = existingUser.id;
            } else {
                console.error("Could not find user after creation error.");
                process.exit(1);
            }
        } else {
            console.error("Error creating user:", createError);
            process.exit(1);
        }
    } else {
        console.log("Admin user created successfully.");
        userId = userData.user.id;
    }

    console.log(`Setting admin role for profile ${userId}...`);
    const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId);

    if (updateError) {
        console.error("Error updating profile role:", updateError);
        // Might fail if the trigger hasn't created the profile yet or table doesn't have role yet
        console.log("Waiting 3 seconds just in case trigger is delayed...");
        await new Promise(r => setTimeout(r, 3000));
        const { error: retryError } = await supabaseAdmin
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId);
        if (retryError) console.error("Still error updating profile:", retryError, "- ensure schema.sql is run first.");
    } else {
        console.log("Admin role set successfully!");
    }
}

setupAdmin();
