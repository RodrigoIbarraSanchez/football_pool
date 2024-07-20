class TestMailer < ApplicationMailer
  def test_email
    mail(to: 'rodrigoibarrasanchez@gmail.com', subject: 'Test Email', body: 'This is a test email')
  end
end
