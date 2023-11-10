import React, { useEffect } from 'react';
import { useNavigation, useLoaderData, useSubmit } from 'react-router-dom';

interface LoaderData {
  contacts?: any; // Replace with the appropriate type for contacts
  q?: string;
}

const SearchInput = ({ modelValue, placeholder, modal }) => {
  async function loader({ request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const contacts = await q;
    return { q };
  }

  const navigation = useNavigation();
  const submit = useSubmit();
  const { contacts, q } = useLoaderData() as LoaderData; // Type assertion here

  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');

  useEffect(() => {
    (document.getElementById('q') as HTMLInputElement).value = q; // Type assertion here
  }, [q]);

  return (
    <div
      id="search-form"
      role="search"
      className={`flex items-center ${modal ? 'border-b bg-skin-bg px-4 py-3' : ''}`}
    >
      <input
        id="q"
        aria-label="Search contacts"
        placeholder="Search"
        type="search"
        name="q"
        className="input w-full flex-auto border-none"
        defaultValue={q}
        onChange={(event) => {
          const isFirstSearch = q == null;
          submit(event.currentTarget.form, {
            replace: !isFirstSearch,
          });
        }}
      />
    </div>
  );
};

export default SearchInput;
