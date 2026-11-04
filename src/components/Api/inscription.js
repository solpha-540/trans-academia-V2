import Layout from '../components/Layout'
import Link from 'next/link'

export default function Inscription() {
  return (
    <Layout>
      <section className="auth-card">
        <h2>Inscription</h2>
        <form className="auth-form" onSubmit={(e)=>e.preventDefault()}>
          <label>
            Nom
            <input type="text" placeholder="Votre nom" required />
          </label>
          <label>
            Email
            <input type="email" placeholder="you@example.com" required />
          </label>
          <label>
            Mot de passe
            <input type="password" placeholder="••••••••" required />
          </label>
          <button className="btn primary" type="submit">S'inscrire</button>
        </form>
        <p className="muted">Déjà inscrit ? <Link href="/login">Connectez-vous</Link></p>
      </section>
    </Layout>
  )
}
