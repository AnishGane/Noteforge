import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";

interface Props {
  userName: string;
  userEmail: string;
  verificationLink: string;
}

const VerificationEmail = (props: Props) => {
  const { userName, userEmail, verificationLink } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section>
              <Text className="text-[32px] font-bold text-gray-900 mb-[8px] text-center">
                Verify Your Email Address
              </Text>
              <Text className="text-[16px] text-gray-600 mb-[32px] text-center">
                We need to verify your email address to complete your account
                setup
              </Text>
            </Section>

            {/* Main Content */}
            <Section>
              <Text className="text-[16px] text-gray-700 mb-[16px]">
                Hello {userName},
              </Text>
              <Text className="text-[16px] text-gray-700 mb-[24px] leading-[24px]">
                Thank you for signing up! To get started, please verify your
                email address by clicking the button below. This helps us ensure
                the security of your account and keep you updated with important
                information.
              </Text>

              {/* Verification Button */}
              <Section className="text-center mb-[32px]">
                <Button
                  href={verificationLink}
                  className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[16px] leading-[20px]">
                If the button above doesn't work, you can also copy and paste
                the following link into your browser:
              </Text>
              <Text className="text-[14px] text-blue-600 mb-[24px] break-all">
                {verificationLink}
              </Text>

              <Text className="text-[14px] text-gray-600 mb-[24px] leading-[20px]">
                This verification link will expire in 24 hours for security
                reasons. If you didn't create an account with us, you can safely
                ignore this email.
              </Text>
            </Section>

            <Hr className="border-gray-200 mb-[24px]" />

            {/* Footer */}
            <Section>
              <Text className="text-[12px] text-gray-500 mb-[8px] m-0">
                Need help? Contact our support team at support@company.com
              </Text>
              <Text className="text-[12px] text-gray-500 mb-[16px] m-0">
                Company Name, 123 Business Street, City, State 12345
              </Text>
              <Text className="text-[12px] text-gray-500 m-0">
                © 2026 Company Name. All rights reserved. |
                <a href="#" className="text-blue-600 no-underline ml-[4px]">
                  Unsubscribe
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;
