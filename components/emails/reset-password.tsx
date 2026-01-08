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
  resetLink: string;
  requestTime: string;
}

const PasswordResetEmail = (props: Props) => {
  const { userName, userEmail, resetLink, requestTime } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section>
              <Text className="text-[32px] font-bold text-gray-900 mb-[8px] text-center">
                Reset Your Password
              </Text>
              <Text className="text-[16px] text-gray-600 mb-[32px] text-center">
                We received a request to reset your password
              </Text>
            </Section>

            {/* Main Content */}
            <Section>
              <Text className="text-[16px] text-gray-700 mb-[16px]">
                Hello {userName},
              </Text>
              <Text className="text-[16px] text-gray-700 mb-[24px] leading-[24px]">
                Someone requested a password reset for your account associated
                with <strong>{userEmail}</strong>. If this was you, click the
                button below to reset your password.
              </Text>

              {/* Reset Button */}
              <Section className="text-center mb-[32px]">
                <Button
                  href={resetLink}
                  className="bg-red-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[16px] leading-[20px]">
                If the button above doesn't work, you can also copy and paste
                the following link into your browser:
              </Text>
              <Text className="text-[14px] text-blue-600 mb-[24px] break-all">
                {resetLink}
              </Text>

              {/* Security Information */}
              <Section className="bg-yellow-50 border-l-4 border-yellow-400 p-[16px] mb-[24px]">
                <Text className="text-[14px] text-yellow-800 mb-[8px] font-semibold">
                  Security Notice:
                </Text>
                <Text className="text-[14px] text-yellow-700 mb-[8px] leading-[20px]">
                  • This reset link will expire in 1 hour for your security
                </Text>
                <Text className="text-[14px] text-yellow-700 mb-[8px] leading-[20px]">
                  • Request was made on {requestTime}
                </Text>
                <Text className="text-[14px] text-yellow-700 leading-[20px]">
                  • If you didn't request this, please ignore this email or
                  contact support
                </Text>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[24px] leading-[20px]">
                If you didn't request a password reset, you can safely ignore
                this email. Your password will remain unchanged, and no further
                action is required.
              </Text>

              <Text className="text-[14px] text-gray-600 mb-[24px] leading-[20px]">
                For your security, we recommend using a strong password that
                includes a mix of letters, numbers, and special characters.
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

export default PasswordResetEmail;
