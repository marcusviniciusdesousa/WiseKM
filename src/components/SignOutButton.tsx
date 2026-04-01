import { logoutUsuario } from "@/actions/auth.actions";

export function SignOutButton() {
  return (
    <form action={logoutUsuario}>
      <button
        type="submit"
        className="px-4 py-2 rounded-full text-caption font-semibold bg-danger text-white hover:bg-danger-hover shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
      >
        Sair
      </button>
    </form>
  );
}