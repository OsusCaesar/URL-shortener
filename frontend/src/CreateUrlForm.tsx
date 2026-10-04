import { useState, type ChangeEvent, type SubmitEvent } from "react";

interface CreateUrlFormProps {
	refreshList: () => void;
}

function CreateUrlForm({ refreshList }: CreateUrlFormProps) {
	const [inputUrl, setInputUrl] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [shortUrl, setShortUrl] = useState<string | null>(null);
	
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		setError(null);
		setShortUrl(null);
		setIsLoading(true);
		// POST
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/urls`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ originUrl: inputUrl }),
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message ?? "Something went wrong");
			}
			setShortUrl(data.shortUrl);
			refreshList();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Unknown error");
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value: string = event.target.value;
		setInputUrl(value);
	};

	return (
		<div className="mb-4">
			<form
				onSubmit={handleSubmit}
				className="p-2 bg-gray-200 rounded-lg flex gap-2"	
			>
				<input 
					type="text" 
					required={true} 
					placeholder="https://..." 
					autoComplete="off" 
					onChange={handleChange} 
					value={inputUrl}
					className="min-w-0 w-full px-1 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#A64160]"
				/>
				<button 
					type="submit"
					disabled={isLoading}
					className="px-4 py-2 bg-[#A64160] text-white rounded hover:bg-[#84223F] disabled:opacity-50"
				>
					{isLoading ? '...' : 'Shorten'}
				</button>
			</form>
			{error && <p className="mt-2 font-bold text-red-500">{error}</p>}
			{shortUrl &&
				<p className="mt-2 font-medium">
					<span className="text-green-600">Success!</span> Your short URL is: <a 
							href={shortUrl} 
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-blue-600 hover:underline"
						>
							{shortUrl}
						</a>
				</p>}
		</div>
	);
}

export default CreateUrlForm;