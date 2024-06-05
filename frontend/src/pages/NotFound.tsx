import { useNavigate } from "react-router-dom"

export function NotFound() {
	const navigate = useNavigate()
	return (
		<article tw="px-6 h-full w-full" onClick={() => navigate("/")}>
			404 not found
		</article>
	)
}
