import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type ContactFormNotificationProps = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: string;
  siteUrl: string;
  siteName: string;
};

export function ContactFormNotification({
  name,
  email,
  phone,
  message,
  submittedAt,
  siteUrl,
  siteName,
}: ContactFormNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Ново съобщение от {name} през {siteName}
      </Preview>
      <Body
        style={{
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#f6f9fc",
          padding: "40px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "32px",
            maxWidth: "560px",
            margin: "0 auto",
            borderRadius: "8px",
          }}
        >
          <Heading as="h2" style={{ fontSize: "18px", marginTop: 0 }}>
            Ново съобщение от contact form
          </Heading>
          <Text style={{ color: "#6b7280", fontSize: "13px" }}>
            Сайт: <a href={siteUrl}>{siteName}</a>
            <br />
            Изпратено: {submittedAt}
          </Text>
          <Hr />
          <Section>
            <Text>
              <strong>Име:</strong> {name}
            </Text>
            <Text>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${email}`}>{email}</a>
            </Text>
            {phone ? (
              <Text>
                <strong>Телефон:</strong> {phone}
              </Text>
            ) : null}
          </Section>
          <Hr />
          <Heading as="h3" style={{ fontSize: "14px" }}>
            Съобщение
          </Heading>
          <Text style={{ whiteSpace: "pre-wrap" }}>{message}</Text>
        </Container>
      </Body>
    </Html>
  );
}
