import { useEffect, useState } from "react";
import type { ApiUrl, Url } from "./types";

interface UrlListProps {
	refreshToggle: boolean;
}

function UrlList({ refreshToggle }: UrlListProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [urls, setUrls] = useState<Url[]>([]);

	async function fetchUrls() {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/urls`);
			if (!response.ok)
				throw new Error('Failed to load URLs');
			const data: ApiUrl[] = await response.json();
			setUrls(data.map((item) => ({ ...item, date: new Date(item.date) })));
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Unknown error');
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchUrls();
	}, [refreshToggle]);

	const thClass = "px-4 py-2 text-left border-b border-gray-400";
	const tdClass = "px-4 py-2 text-left border-b border-gray-200";

	return (
		<div className="overflow-x-auto">
			{isLoading && urls.length === 0 && <p>Loading...</p>}
			{error && <p className="font-bold text-red-500">{error}</p>}
			{!isLoading && !error && urls.length === 0 && (
				<p className="text-gray-500">No URLs yet.</p>
			)}
			{urls.length > 0 && (
				<table className="w-full border-collapse">
					<thead>
						<tr>
							<th scope="col" className={thClass}>Id</th>
							<th scope="col" className={thClass}>Origin URL</th>
							<th scope="col" className={thClass}>Short URL</th>
							<th scope="col" className={thClass}>Date</th>
						</tr>
					</thead>
					<tbody>
						{urls.map((url) => (
							<tr key={url.id}>
								<th scope="row" className={tdClass}>{url.id}</th>
								<td className={`${tdClass} max-w-2xs truncate`}>
									<a 
										href={url.originUrl} 
										target="_blank"
										rel="noopener noreferrer"
										className="hover:text-blue-600 hover:underline"
										title={url.originUrl}
									>
										{url.originUrl}
									</a>
								</td>
								<td className={tdClass}>
									<a 
										href={url.shortUrl} 
										target="_blank"
										rel="noopener noreferrer"
										className="hover:text-blue-600 hover:underline"
									>
										{url.shortUrl}
									</a>
								</td>
								<td className={tdClass}>{url.date.toLocaleDateString(undefined, {hour: "numeric", minute: "numeric", day: "numeric", month: "numeric", year: "2-digit"})}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default UrlList;