import { FC, Fragment, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import desktoplogo from "../../../../assets/images/brand-logos/desktop-logo.png";
import desktopdarklogo from "../../../../assets/images/brand-logos/desktop-dark.png";
import { resetPassword, sendPasswordOtp } from '../../../../components/Api/passwordResetService';

interface ResetbasicProps {}

type ResetStep = 1 | 2 | 3;

const Resetbasic: FC<ResetbasicProps> = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<ResetStep>(1);
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const maskedContact = useMemo(() => {
    if (!contact) return '';
    const digits = contact.replace(/\D/g, '');
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 2)}***${digits.slice(-2)}`;
  }, [contact]);

  const normalizeContact = (value: string) => value.replace(/\D/g, '');

  const goToLogin = () => {
    navigate(import.meta.env.BASE_URL || '/');
  };

  const handleSendOtp = async () => {
    const nextContact = normalizeContact(contact);

    if (!nextContact) {
      setErrorMessage('Veuillez saisir votre numéro de téléphone.');
      toast.error('Veuillez saisir votre numéro de téléphone.');
      return;
    }

    setIsSendingOtp(true);
    setErrorMessage('');

    try {
      const response = await sendPasswordOtp(nextContact);
      const payload = response.data;
      const canReset = payload?.data?.can_reset ?? true;

      if (payload?.code !== 200 || !canReset) {
        const resultMessage = payload?.message || 'La réinitialisation n’est pas autorisée pour ce compte.';
        setErrorMessage(resultMessage);
        toast.error(resultMessage);
        return;
      }

      setContact(nextContact);
      setStep(2);
      toast.success(payload?.message || 'Un code OTP a été envoyé sur votre numéro.');
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Impossible d’envoyer le code OTP.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const goBackToStepOne = () => {
    setStep(1);
    setOtp('');
    setErrorMessage('');
  };

  const handleSubmitPasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedPhone = normalizeContact(contact);
    const cleanOtp = otp.replace(/\D/g, '');

    if (!normalizedPhone) {
      setErrorMessage('Le numéro de téléphone est requis.');
      toast.error('Le numéro de téléphone est requis.');
      return;
    }

    if (!cleanOtp) {
      setErrorMessage('Le code OTP est requis.');
      toast.error('Le code OTP est requis.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Le nouveau mot de passe est requis.');
      toast.error('Le nouveau mot de passe est requis.');
      return;
    }

    if (!confirmPassword.trim()) {
      setErrorMessage('Veuillez confirmer le nouveau mot de passe.');
      toast.error('Veuillez confirmer le nouveau mot de passe.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Les deux mots de passe ne correspondent pas.');
      toast.error('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setIsResetting(true);
    setErrorMessage('');

    try {
      const response = await resetPassword({
        otp: Number(cleanOtp),
        pwd: password,
        pwd_confirm: confirmPassword,
        contact: normalizedPhone,
      });

      const payload = response.data;
      if (payload?.code !== 200) {
        const message = payload?.message || 'La réinitialisation du mot de passe a échoué.';
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      toast.success(payload?.message || 'Mot de passe modifié avec succès.');
      setContact('');
      setOtp('');
      setPassword('');
      setConfirmPassword('');
      setStep(1);
      setTimeout(() => {
        goToLogin();
      }, 1200);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'La réinitialisation du mot de passe a échoué.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsResetting(false);
    }
  };

  const stepTitle =
    step === 1 ? 'Récupération du mot de passe' :
    step === 2 ? 'Vérification du code OTP' :
    'Définition du nouveau mot de passe';

  return (
    <Fragment>
      <div className="container">
        <div className="flex justify-center authentication authentication-basic items-center min-h-screen text-defaultsize text-defaulttextcolor">
          <div className="grid grid-cols-12 w-full max-w-6xl">
            <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-2 sm:col-span-1"></div>
            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-8 sm:col-span-10 col-span-12">
              <div className="my-[1.5rem] flex justify-center">
                <Link to={`${import.meta.env.BASE_URL}/`} className="inline-flex items-center justify-center">
                  <img src={desktoplogo} alt="logo" className="desktop-logo h-16 w-auto" />
                  <img src={desktopdarklogo} alt="logo" className="desktop-dark h-16 w-auto" />
                </Link>
              </div>


              

              <div className="box">
                <div className="box-body !p-[2.5rem]">
                  <div className="mb-4 text-center">
                    <p className="h5 font-semibold mb-2">{stepTitle}</p>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      {[1, 2, 3].map((item) => (
                        <span
                          key={item}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                            step >= item ? 'bg-primary text-white' : 'bg-light text-default'
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="grid grid-cols-12 gap-y-4">
                      <div className="xl:col-span-12 col-span-12">
                        <label htmlFor="reset-contact" className="form-label text-default">Numéro de téléphone</label>
                        <input
                          id="reset-contact"
                          type="tel"
                          inputMode="numeric"
                          className="form-control form-control-lg"
                          placeholder="Ex : 828191010"
                          value={contact}
                          onChange={(event) => setContact(event.target.value.replace(/\D/g, ''))}
                        />
                      </div>

                      <div className="xl:col-span-12 col-span-12 grid mt-2">
                        <button
                          type="button"
                          className="ti-btn ti-btn-lg bg-primary text-white !font-medium dark:border-defaultborder/10 disabled:opacity-60"
                          onClick={handleSendOtp}
                          disabled={isSendingOtp}
                        >
                          {isSendingOtp ? 'Envoi en cours...' : 'Envoyer le code OTP'}
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid grid-cols-12 gap-y-4">
                      <div className="xl:col-span-12 col-span-12">
                        <div className="mb-2 text-sm text-[#8c9097]">
                          Code envoyé au numéro <strong>{maskedContact || contact}</strong>
                        </div>
                        <label htmlFor="reset-otp" className="form-label text-default">Code OTP</label>
                        <input
                          id="reset-otp"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          className="form-control form-control-lg"
                          placeholder="Entrez le code reçu par SMS"
                          value={otp}
                          onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                        />
                      </div>

                      <div className="xl:col-span-12 col-span-12 grid gap-2 mt-2">
                        <button
                          type="button"
                          className="ti-btn ti-btn-lg bg-primary text-white !font-medium dark:border-defaultborder/10 disabled:opacity-60"
                          onClick={() => {
                            if (!otp.trim()) {
                              setErrorMessage('Le code OTP est requis.');
                              toast.error('Le code OTP est requis.');
                              return;
                            }
                            setErrorMessage('');
                            setStep(3);
                          }}
                        >
                          Vérifier le code
                        </button>

                        <button
                          type="button"
                          className="ti-btn ti-btn-lg bg-light text-default border border-defaultborder dark:border-defaultborder/10"
                          onClick={goBackToStepOne}
                        >
                          Retour
                        </button>

                        <button
                          type="button"
                          className="ti-btn ti-btn-sm text-primary underline underline-offset-2"
                          onClick={handleSendOtp}
                          disabled={isSendingOtp}
                        >
                          {isSendingOtp ? 'Renvoi en cours...' : 'Renvoyer le code'}
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <form className="grid grid-cols-12 gap-y-4" onSubmit={handleSubmitPasswordReset}>
                      <div className="xl:col-span-12 col-span-12">
                        <label className="form-label text-default">Numéro de téléphone</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={maskedContact || contact}
                          disabled
                          readOnly
                        />
                      </div>

                      <div className="xl:col-span-12 col-span-12">
                        <label htmlFor="new-password" className="form-label text-default">Nouveau mot de passe</label>
                        <div className="input-group">
                          <input
                            id="new-password"
                            type={showPassword ? 'text' : 'password'}
                            className="form-control form-control-lg !border-s !rounded-e-none"
                            placeholder="Entrez votre nouveau mot de passe"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                          />
                          <button
                            type="button"
                            className="ti-btn !mb-0 !rounded-s-none bg-light border border-defaultborder dark:border-defaultborder/10"
                            onClick={() => setShowPassword((current) => !current)}
                          >
                            <i className={showPassword ? 'ri-eye-line' : 'ri-eye-off-line'}></i>
                          </button>
                        </div>
                      </div>

                      <div className="xl:col-span-12 col-span-12">
                        <label htmlFor="confirm-password" className="form-label text-default">Confirmer le nouveau mot de passe</label>
                        <div className="input-group">
                          <input
                            id="confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="form-control form-control-lg !border-s !rounded-e-none"
                            placeholder="Confirmez votre mot de passe"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                          />
                          <button
                            type="button"
                            className="ti-btn !mb-0 !rounded-s-none bg-light border border-defaultborder dark:border-defaultborder/10"
                            onClick={() => setShowConfirmPassword((current) => !current)}
                          >
                            <i className={showConfirmPassword ? 'ri-eye-line' : 'ri-eye-off-line'}></i>
                          </button>
                        </div>
                      </div>

                      <div className="xl:col-span-12 col-span-12 grid gap-2 mt-2">
                        <button
                          type="submit"
                          className="ti-btn ti-btn-lg bg-primary text-white !font-medium dark:border-defaultborder/10 disabled:opacity-60"
                          disabled={isResetting}
                        >
                          {isResetting ? 'Réinitialisation...' : 'Réinitialiser mon mot de passe'}
                        </button>

                        <button
                          type="button"
                          className="ti-btn ti-btn-lg bg-light text-default border border-defaultborder dark:border-defaultborder/10"
                          onClick={() => setStep(2)}
                        >
                          Retour
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="text-center mt-4">
                    <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                      Vous avez déjà un compte ?{' '}
                      <button type="button" className="text-primary underline" onClick={goToLogin}>
                        Se connecter
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Resetbasic;