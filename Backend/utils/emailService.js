const nodemailer = require('nodemailer');
const util = require('util');
const sgMail = require('@sendgrid/mail');

// Decide whether to use SendGrid (for Render/production) or Gmail SMTP (for local/dev)
const useSendGrid = !!process.env.SENDGRID_API_KEY;
let transporter = null;

if (useSendGrid) {
    // HTTP-based email sending works on Render (no blocked SMTP ports)
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('Email service configured to use SendGrid');
} else {
    // Prefer pooling and stronger TLS for more reliable connections. Keep credentials in env when possible.
    transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // STARTTLS; more commonly allowed through firewalls
        auth: {
            user: process.env.EMAIL_USER || 'syntaxsquadfinalyearproject@gmail.com',
            pass: process.env.EMAIL_PASS || 'nhif qwky uxza delu'
        },
        pool: true,
        tls: { rejectUnauthorized: false }
    });

    // Verify transporter at startup to get early feedback (only in dev/local)
    transporter.verify().then(() => {
        console.log('Email transporter (Gmail SMTP) verified and ready');
    }).catch(err => {
        console.error('Email transporter verification failed:', err && err.message ? err.message : err);
    });
}

// Helper to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Send with retry/backoff for transient network errors (ECONNRESET, ETIMEDOUT, etc.)
async function sendWithRetry(mailOptions, maxAttempts = 3) {
    const transientCodes = new Set(['ECONNRESET', 'ETIMEDOUT', 'EPIPE', 'ENOTFOUND', 'ECONNREFUSED']);
    let attempt = 0;
    let lastErr;
    while (++attempt <= maxAttempts) {
        try {
            let info;

            if (useSendGrid) {
                // Map Nodemailer-style options to SendGrid
                const msg = {
                    to: mailOptions.to,
                    from: mailOptions.from || (process.env.SENDGRID_FROM || process.env.EMAIL_USER || 'syntaxsquadfinalyearproject@gmail.com'),
                    subject: mailOptions.subject,
                    html: mailOptions.html,
                    bcc: mailOptions.bcc
                };
                const [response] = await sgMail.send(msg);
                info = {
                    response: `SendGrid status ${response.statusCode}`,
                    accepted: [mailOptions.to],
                    rejected: []
                };
            } else {
                // Use nodemailer transporter when running locally
                if (!transporter) {
                    throw new Error('Nodemailer transporter is not initialized');
                }
                info = await transporter.sendMail(mailOptions);
            }

            // log accepted/rejected recipients for debugging
            if (info && (info.accepted || info.rejected)) {
                console.log(`Email send info for ${mailOptions.to}: accepted=${JSON.stringify(info.accepted)}, rejected=${JSON.stringify(info.rejected)}`);
            } else {
                console.log(`Email send info for ${mailOptions.to}:`, info && info.response ? info.response : info);
            }
            return info;
        } catch (err) {
            lastErr = err;
            const code = err && err.code;
            console.error(`Email send attempt ${attempt} failed for ${mailOptions.to}:`, err && err.message ? err.message : err, 'code=', code);
            // If transient and we have attempts left, backoff and retry
            if (attempt < maxAttempts && code && transientCodes.has(code)) {
                const backoff = 500 * Math.pow(2, attempt - 1); // 500ms, 1000ms, 2000ms...
                console.log(`Retrying email to ${mailOptions.to} in ${backoff}ms (attempt ${attempt + 1}/${maxAttempts})`);
                await sleep(backoff);
                continue;
            }
            // For non-transient or exhausted attempts, rethrow
            throw err;
        }
    }
    throw lastErr;
}

const sendWelcomeEmail = async (engineerData) => {
    const results = {
        engineer: false,
        nominee: false,
        familyMember1: false,
        familyMember2: false
    };

    try {
        // If updateNotification is present, use its html and subject for all recipients
        const isUpdate = engineerData.updateNotification && engineerData.updateNotification.html;
        const updateHtml = isUpdate ? engineerData.updateNotification.html : null;
        const updateSubject = isUpdate ? 'Profile Updated Notification' : null;

        // Send email to doctor
        const engineerMailOptions = {
            from: `Engineers Community <${process.env.EMAIL_USER || 'syntaxsquadfinalyearproject@gmail.com'}>`,
            to: engineerData.email,
            subject: isUpdate ? updateSubject : 'Welcome to Engineers Community',
            html: isUpdate ? updateHtml : `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2D3748;">Welcome to Engineers Community</h2>
                    <p style="color: #4A5568; font-size: 16px;">Dear Engineer ${engineerData.name},</p>
                    <p style="color: #4A5568; font-size: 16px;">
                        Thank you for registering with the Engineers Community. We're delighted to have you as a member
                        of our growing medical professional network.
                    </p>
                    <p style="color: #4A5568; font-size: 16px;">
                        Your registration has been successfully completed. You can now log in to your account
                        and start using our platform's features.
                    </p>
                    
                    <div style="margin: 30px 0; padding: 20px; background-color: #E6FFFA; border-radius: 8px;">
                        <h3 style="color: #234E52; margin-top: 0;">Important: ENGINEERS SELF SUPPORT SCHEME (ESS) Terms and Conditions</h3>
                        <p style="color: #234E52; margin: 10px 0;">
                            By creating an account with Engineers Community, you agree to the following comprehensive terms and conditions:
                        </p>
                        
                        <div style="color: #234E52; margin: 15px 0;">
                            <h4 style="color: #2D3748; margin: 10px 0;">About ESS</h4>
                            <p style="margin: 5px 0;">ENGINEERS SELF SUPPORT SCHEME (ESS) was established for ENGINEERS and by ENGINEERS to support them. ESS is managed by the ENGINEERS TRUST.</p>
                        </div>

                        <div style="color: #234E52; margin: 15px 0;">
                            <h4 style="color: #2D3748; margin: 10px 0;">Main Rules (For Members)</h4>
                            <ol style="margin: 10px 0; padding-left: 20px;">
                                <li style="margin: 5px 0;">To join the Engineers self support scheme, Engineers can voluntarily join by registering through the website after agreeing to all the terms and conditions. Membership fee is charged yearly for joining the Engineers self support scheme.</li>
                                <li style="margin: 5px 0;">To join the Engineers self support scheme, registration is mandatory by filling out the required information form. ESS has a rule since its inception: only those who cooperate will receive support. All that is required is to send support to the family of the deceased members.</li>
                                <li style="margin: 5px 0;">The lock-in period for all types of members will be 12 months/1 year. Support will not be provided if a nominee is accused of suicide or murder, and in special circumstances, the final decision will be that of the ESS.</li>
                                <li style="margin: 5px 0;">The ESS will be free to exercise its discretion in making decisions regarding calls for contributions, including conducting its own due diligence on legality or any other matters as deemed appropriate.</li>
                                <li style="margin: 5px 0;">During or after the contribution, if an Engineer mistakenly sends an excess amount to the account of a nominee, the nominee will be required to return the funds to the Engineers/member's account upon presenting appropriate evidence.</li>
                                <li style="margin: 5px 0;">Currently, it is mandatory to make all contributions to receive contributions. After becoming a member and completing all contributions after the lock-in period, it will be mandatory to upload the receipt by filling out the website/Google form as per the rules.</li>
                                <li style="margin: 5px 0;">If an Engineer fails to cooperate after becoming a member or does not cooperate with anyone in the interim, they will no longer be a statutory member. Such members can activate their statutory status by contributing 100%.</li>
                                <li style="margin: 5px 0;">If a member leaves the association once in a year, he can become legal again after paying all dues and contributions.</li>
                                <li style="margin: 5px 0;">In the event of the death of more than one Engineer/member, assistance will be provided in the order of their death date. However, if two or more Engineers die on the same date, the Engineer with the highest percentage/average of assistance will be provided first, followed by the others.</li>
                                <li style="margin: 5px 0;">In case of any dispute regarding the nominee, the State/Core Team will be free to take a decision after due scrutiny and provide assistance.</li>
                                <li style="margin: 5px 0;">All information on the Telegram/WhatsApp/App is provided from time to time. Any member who does not receive information from the Telegram group will be held responsible.</li>
                                <li style="margin: 5px 0;">Members will be able to get their queries answered through the helpline.</li>
                                <li style="margin: 5px 0;">Any of the rules of ESS may be amended/changed at any time as per the need and requirement of the time.</li>
                                <li style="margin: 5px 0;">Members make the contribution directly into the account of the nominee of the deceased families and hence no individual or member will have the right to raise any kind of judicial challenge.</li>
                                <li style="margin: 5px 0;">ESS does not force or coerce any Engineer into becoming a member, members are given the option to become a member only after accepting the rules, any member can voluntarily dissociate himself at any time.</li>
                                <li style="margin: 5px 0;">There is a yearly membership fee to join ESS. Any Engineer can become a member and contribute by agreeing to the terms and conditions and registering.</li>
                                <li style="margin: 5px 0;">Upon becoming a member of ESS, it is mandatory to join the ESS Telegram group/WhatsApp group/Install ESS App as all official information will be provided through these only.</li>
                                <li style="margin: 5px 0;">The ESS will be authorized to make decisions regarding members who submit forged/falsified receipts or act contrary to the rules during the collaboration. Such members may be terminated and denied benefits.</li>
                            </ol>
                        </div>

                        <div style="color: #234E52; margin: 15px 0;">
                            <h4 style="color: #2D3748; margin: 10px 0;">ESS Facilities</h4>
                            <p style="margin: 5px 0;">The ESS will provide the following facilities to all the members from the amount received for Membership fee:</p>
                            <ol style="margin: 10px 0; padding-left: 20px;">
                                <li style="margin: 5px 0;">In the creation and operation of the website.</li>
                                <li style="margin: 5px 0;">Developing and operating the app.</li>
                                <li style="margin: 5px 0;">In providing SMS facility.</li>
                                <li style="margin: 5px 0;">To have an office and a technical support that will provide you technical help.</li>
                                <li style="margin: 5px 0;">In conducting on-site inspection.</li>
                                <li style="margin: 5px 0;">In the campaign to connect maximum number of Engineers with ESS.</li>
                                <li style="margin: 5px 0;">Use of new technology from time to time so that the process becomes transparent as well as easy.</li>
                            </ol>
                        </div>

                        <div style="color: #234E52; margin: 15px 0; padding: 15px; background-color: #FEF5E7; border-radius: 5px; border-left: 4px solid #F6AD55;">
                            <p style="margin: 5px 0;"><strong>Important Note:</strong> Members give their contribution directly to the nominee of the deceased Engineer, hence there will be no legal right to receive any contribution in return for the contribution given by you, it will completely depend on the wish of the members. The ESS will not be responsible in case the contribution is less or no more after the appeal by the team.</p>
                            <p style="margin: 5px 0;">If someone joins by hiding facts or without fulfilling the eligibility criteria and gives contribution, then his claim will not be valid.</p>
                            <p style="margin: 5px 0;"><strong>In case of any decision, only the copy of the rules uploaded on the website will be valid.</strong></p>
                        </div>
                    </div>
                    
                    <div style="margin: 30px 0; padding: 20px; background-color: #F7FAFC; border-radius: 8px; border-left: 4px solid #3182CE;">
                        <h3 style="color: #2D3748; margin-top: 0;">Next Steps</h3>
                        <p style="color: #4A5568; margin: 10px 0;">
                            • Log in to your account to complete your profile<br>
                            • Review your membership benefits and contribution schedule<br>
                            • Connect with other professionals in our community<br>
                            • Access exclusive resources and support services
                        </p>
                    </div>
                    
                    <div style="margin: 30px 0; padding: 20px; background-color: #E6FFFA; border-radius: 8px;">
                        <p style="color: #234E52; margin: 0;">
                            If you have any questions or need assistance, please don't hesitate to contact us.
                        </p>
                    </div>
                    
                    <p style="color: #4A5568; font-size: 16px;">
                        Best regards,<br>
                        The Engineers Community Team
                    </p>
                </div>
            `
        };
        // add BCC fallback so nominee/family also receive at least one copy if individual sends fail
        const bccRecipients = [];
        if (engineerData.nominee && engineerData.nominee.email) bccRecipients.push(engineerData.nominee.email);
        if (engineerData.familyMember1 && engineerData.familyMember1.email) bccRecipients.push(engineerData.familyMember1.email);
        if (engineerData.familyMember2 && engineerData.familyMember2.email) bccRecipients.push(engineerData.familyMember2.email);
        if (bccRecipients.length > 0) engineerMailOptions.bcc = bccRecipients.join(',');
        try {
            console.log('Attempting to send email to engineer:', engineerData.email);
            await sendWithRetry(engineerMailOptions);
            console.log((isUpdate ? 'Profile update' : 'Welcome') + ' email sent successfully to engineer:', engineerData.email);
            results.engineer = true;
        } catch (err) {
            console.error('Failed to send email to engineer after retries:', engineerData.email, err && err.message ? err.message : err);
        }

        // Send email to nominee if exists and has email
        if (engineerData.nominee && engineerData.nominee.email) {
            console.log('Nominee contact found, sending email to:', engineerData.nominee);
            const nomineeMailOptions = {
                from: `Doctors Community <${process.env.EMAIL_USER || 'syntaxsquadfinalyearproject@gmail.com'}>`,
                to: engineerData.nominee.email,
                subject: isUpdate ? updateSubject : 'Engineer Registration Notification - Engineers Community',
                html: isUpdate ? updateHtml : `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2D3748;">Engineer Registration Notification</h2>
                        <p style="color: #4A5568; font-size: 16px;">Dear ${engineerData.nominee.name},</p>
                        <p style="color: #4A5568; font-size: 16px;">
                            This email is to inform you that Engineer ${engineerData.name} has registered with the Engineers Community
                            and has listed you as their nominee.
                        </p>
                        <p style="color: #4A5568; font-size: 16px;">
                            As a nominee, you will be kept informed about important updates and notifications
                            related to Engineer ${engineerData.name}'s membership.
                        </p>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #E6FFFA; border-radius: 8px;">
                            <h3 style="color: #234E52; margin-top: 0;">Important: ENGINEERS SELF SUPPORT SCHEME (ESS) Terms and Conditions</h3>
                            <p style="color: #234E52; margin: 10px 0;">
                                As a nominee, you should be aware of the following comprehensive terms and conditions:
                            </p>
                            
                            <div style="color: #234E52; margin: 15px 0;">
                                <h4 style="color: #2D3748; margin: 10px 0;">About ESS</h4>
                                <p style="margin: 5px 0;">ENGINEERS SELF SUPPORT SCHEME (ESS) was established for ENGINEERS and by ENGINEERS to support them. ESS is managed by the ENGINEERS TRUST.</p>
                            </div>

                            <div style="color: #234E52; margin: 15px 0;">
                                <h4 style="color: #2D3748; margin: 10px 0;">Key Rules for Nominees</h4>
                                <ol style="margin: 10px 0; padding-left: 20px;">
                                    <li style="margin: 5px 0;">The lock-in period for all types of members will be 12 months/1 year. Support will not be provided if a nominee is accused of suicide or murder, and in special circumstances, the final decision will be that of the ESS.</li>
                                    <li style="margin: 5px 0;">During or after the contribution, if an Engineer mistakenly sends an excess amount to the account of a nominee, the nominee will be required to return the funds to the Engineers/member's account upon presenting appropriate evidence.</li>
                                    <li style="margin: 5px 0;">Members make the contribution directly into the account of the nominee of the deceased families and hence no individual or member will have the right to raise any kind of judicial challenge.</li>
                                    <li style="margin: 5px 0;">In case of any dispute regarding the nominee, the State/Core Team will be free to take a decision after due scrutiny and provide assistance.</li>
                                    <li style="margin: 5px 0;">All information on the Telegram/WhatsApp/App is provided from time to time. Any member who does not receive information from the Telegram group will be held responsible.</li>
                                </ol>
                            </div>

                            <div style="color: #234E52; margin: 15px 0; padding: 15px; background-color: #FEF5E7; border-radius: 5px; border-left: 4px solid #F6AD55;">
                                <p style="margin: 5px 0;"><strong>Important Note:</strong> Members give their contribution directly to the nominee of the deceased Engineer, hence there will be no legal right to receive any contribution in return for the contribution given by you, it will completely depend on the wish of the members. The ESS will not be responsible in case the contribution is less or no more after the appeal by the team.</p>
                                <p style="margin: 5px 0;"><strong>In case of any decision, only the copy of the rules uploaded on the website will be valid.</strong></p>
                            </div>
                        </div>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #E6FFFA; border-radius: 8px;">
                            <p style="color: #234E52; margin: 0;">
                                If you have any questions or concerns, please don't hesitate to contact us.
                            </p>
                        </div>
                        <p style="color: #4A5568; font-size: 16px;">
                            Best regards,<br>
                            The Engineers Community Team
                        </p>
                    </div>
                `
            };
            try {
                await sendWithRetry(nomineeMailOptions);
                console.log((isUpdate ? 'Profile update' : 'Notification') + ' email sent successfully to nominee:', engineerData.nominee.email);
                results.nominee = true;
            } catch (err) {
                console.error('Failed to send email to nominee after retries:', engineerData.nominee.email, err && err.message ? err.message : err);
            }
        }

        // Send email to family member 1 if exists and has email
        if (engineerData.familyMember1 && engineerData.familyMember1.email) {
            console.log('Family member 1 contact found, sending email to:', engineerData.familyMember1);
            const familyMember1MailOptions = {
                from: `Doctors Community <${process.env.EMAIL_USER || 'syntaxsquadfinalyearproject@gmail.com'}>`,
                to: engineerData.familyMember1.email,
                subject: isUpdate ? updateSubject : 'Engineer Registration Notification - Engineers Community',
                html: isUpdate ? updateHtml : `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2D3748;">Engineer Registration Notification</h2>
                        <p style="color: #4A5568; font-size: 16px;">Dear ${engineerData.familyMember1.name},</p>
                        <p style="color: #4A5568; font-size: 16px;">
                            This email is to inform you that Engineer ${engineerData.name} has registered with the Engineers Community
                            and has listed you as a family member contact.
                        </p>
                        <p style="color: #4A5568; font-size: 16px;">
                            As a registered family member, you will receive important notifications and updates
                            related to Engineer ${engineerData.name}'s membership.
                        </p>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #E6FFFA; border-radius: 8px;">
                            <h3 style="color: #234E52; margin-top: 0;">Important: ENGINEERS SELF SUPPORT SCHEME (ESS) Terms and Conditions</h3>
                            <p style="color: #234E52; margin: 10px 0;">
                                As a family member, you should be aware of the following comprehensive terms and conditions:
                            </p>
                            
                            <div style="color: #234E52; margin: 15px 0;">
                                <h4 style="color: #2D3748; margin: 10px 0;">About ESS</h4>
                                <p style="margin: 5px 0;">ENGINEERS SELF SUPPORT SCHEME (ESS) was established for ENGINEERS and by ENGINEERS to support them. ESS is managed by the ENGINEERS TRUST.</p>
                            </div>

                            <div style="color: #234E52; margin: 15px 0;">
                                <h4 style="color: #2D3748; margin: 10px 0;">Key Rules for Family Members</h4>
                                <ol style="margin: 10px 0; padding-left: 20px;">
                                    <li style="margin: 5px 0;">The lock-in period for all types of members will be 12 months/1 year. Support will not be provided if a nominee is accused of suicide or murder, and in special circumstances, the final decision will be that of the ESS.</li>
                                    <li style="margin: 5px 0;">Members make the contribution directly into the account of the nominee of the deceased families and hence no individual or member will have the right to raise any kind of judicial challenge.</li>
                                    <li style="margin: 5px 0;">In case of any dispute regarding the nominee, the State/Core Team will be free to take a decision after due scrutiny and provide assistance.</li>
                                    <li style="margin: 5px 0;">All information on the Telegram/WhatsApp/App is provided from time to time. Any member who does not receive information from the Telegram group will be held responsible.</li>
                                    <li style="margin: 5px 0;">Members will be able to get their queries answered through the helpline.</li>
                                </ol>
                            </div>

                            <div style="color: #234E52; margin: 15px 0; padding: 15px; background-color: #FEF5E7; border-radius: 5px; border-left: 4px solid #F6AD55;">
                                <p style="margin: 5px 0;"><strong>Important Note:</strong> Members give their contribution directly to the nominee of the deceased Engineer, hence there will be no legal right to receive any contribution in return for the contribution given by you, it will completely depend on the wish of the members. The ESS will not be responsible in case the contribution is less or no more after the appeal by the team.</p>
                                <p style="margin: 5px 0;"><strong>In case of any decision, only the copy of the rules uploaded on the website will be valid.</strong></p>
                            </div>
                        </div>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #E6FFFA; border-radius: 8px;">
                            <p style="color: #234E52; margin: 0;">
                                If you have any questions or concerns, please don't hesitate to contact us.
                            </p>
                        </div>
                        <p style="color: #4A5568; font-size: 16px;">
                            Best regards,<br>
                            The Engineers Community Team
                        </p>
                    </div>
                `
            };
            try {
                await sendWithRetry(familyMember1MailOptions);
                console.log((isUpdate ? 'Profile update' : 'Notification') + ' email sent successfully to family member 1:', engineerData.familyMember1.email);
                results.familyMember1 = true;
            } catch (err) {
                console.error('Failed to send email to familyMember1 after retries:', engineerData.familyMember1.email, err && err.message ? err.message : err);
            }
        }

        // Send email to family member 2 if exists and has email
        if (engineerData.familyMember2 && engineerData.familyMember2.email) {
            console.log('Family member 2 contact found, sending email to:', engineerData.familyMember2);
            const familyMember2MailOptions = {
                from: `Doctors Community <${process.env.EMAIL_USER || 'syntaxsquadfinalyearproject@gmail.com'}>`,
                to: engineerData.familyMember2.email,
                subject: isUpdate ? updateSubject : 'Engineer Registration Notification - Engineers Community',
                html: isUpdate ? updateHtml : `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2D3748;">Engineer Registration Notification</h2>
                        <p style="color: #4A5568; font-size: 16px;">Dear ${engineerData.familyMember2.name},</p>
                        <p style="color: #4A5568; font-size: 16px;">
                            This email is to inform you that Engineer ${engineerData.name} has registered with the Engineers Community
                            and has listed you as a family member contact.
                        </p>
                        <p style="color: #4A5568; font-size: 16px;">
                            As a registered family member, you will receive important notifications and updates
                            related to Engineer ${engineerData.name}'s membership.
                        </p>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #E6FFFA; border-radius: 8px;">
                            <h3 style="color: #234E52; margin-top: 0;">Important: HEALTH CARE PROFESSIONALS SELF SUPPORT SCHEME (HCPSST) Terms and Conditions</h3>
                            <p style="color: #234E52; margin: 10px 0;">
                                As a family member, you should be aware of the following comprehensive terms and conditions:
                            </p>
                            
                            <div style="color: #234E52; margin: 15px 0;">
                                <h4 style="color: #2D3748; margin: 10px 0;">About HCPSST</h4>
                                <p style="margin: 5px 0;">HEALTH CARE PROFESSIONALS SELF SUPPORT SCHEME (HCPSST) was established for HEALTH CARE PROFESSIONALS and by HEALTH CARE PROFESSIONALS to support them. HCPSST is managed by the HEALTH CARE PROFESSIONALS TRUST.</p>
                            </div>

                            <div style="color: #234E52; margin: 15px 0;">
                                <h4 style="color: #2D3748; margin: 10px 0;">Key Rules for Family Members</h4>
                                <ol style="margin: 10px 0; padding-left: 20px;">
                                    <li style="margin: 5px 0;">The lock-in period for all types of members will be 12 months/1 year. Support will not be provided if a nominee is accused of suicide or murder, and in special circumstances, the final decision will be that of the HCPSST.</li>
                                    <li style="margin: 5px 0;">Members make the contribution directly into the account of the nominee of the deceased families and hence no individual or member will have the right to raise any kind of judicial challenge.</li>
                                    <li style="margin: 5px 0;">In case of any dispute regarding the nominee, the State/Core Team will be free to take a decision after due scrutiny and provide assistance.</li>
                                    <li style="margin: 5px 0;">All information on the Telegram/WhatsApp/App is provided from time to time. Any member who does not receive information from the Telegram group will be held responsible.</li>
                                    <li style="margin: 5px 0;">Members will be able to get their queries answered through the helpline.</li>
                                </ol>
                            </div>

                            <div style="color: #234E52; margin: 15px 0; padding: 15px; background-color: #FEF5E7; border-radius: 5px; border-left: 4px solid #F6AD55;">
                                <p style="margin: 5px 0;"><strong>Important Note:</strong> Members give their contribution directly to the nominee of the deceased Doctor, hence there will be no legal right to receive any contribution in return for the contribution given by you, it will completely depend on the wish of the members. The HCPSST will not be responsible in case the contribution is less or no more after the appeal by the team.</p>
                                <p style="margin: 5px 0;"><strong>In case of any decision, only the copy of the rules uploaded on the website will be valid.</strong></p>
                            </div>
                        </div>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #E6FFFA; border-radius: 8px;">
                            <p style="color: #234E52; margin: 0;">
                                If you have any questions or concerns, please don't hesitate to contact us.
                            </p>
                        </div>
                        <p style="color: #4A5568; font-size: 16px;">
                            Best regards,<br>
                            The Doctors Community Team
                        </p>
                    </div>
                `
            };
            try {
                await sendWithRetry(familyMember2MailOptions);
                console.log((isUpdate ? 'Profile update' : 'Notification') + ' email sent successfully to family member 2:', doctorData.familyMember2.email);
                results.familyMember2 = true;
            } catch (err) {
                console.error('Failed to send email to familyMember2 after retries:', doctorData.familyMember2.email, err && err.message ? err.message : err);
            }
        }

        return results;
    } catch (error) {
        console.error('Error sending emails:', error);
        return results;
    }
};

module.exports = {
    sendWelcomeEmail
};