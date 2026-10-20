import Link from "next/link";

export function AccessDenied({
  email,
}: {
  email?: string | null;
}) {
  return (
    <div className="admin-access-denied">
      <div className="admin-access-denied__card">
        <p className="admin-access-denied__eyebrow">Admin Panel</p>
        <h1>Access denied</h1>
        <p>
          Your account
          {email ? (
            <>
              {" "}
              (<strong>{email}</strong>)
            </>
          ) : null}{" "}
          does not have an admin role. Ask an owner to grant access.
        </p>
        <div className="admin-access-denied__actions">
          <Link className="admin-btn admin-btn--ghost" href="/">
            Back to site
          </Link>
          <Link className="admin-btn admin-btn--primary" href="/sign-in">
            Switch account
          </Link>
        </div>
      </div>
    </div>
  );
}
