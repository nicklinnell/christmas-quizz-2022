interface FormProps {
  email: string;
  error?: string;
}

export function Form(props: FormProps) {
  const { email, error } = props;

  return (
    <div>
      <form
        method="POST"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="username"
          >
            Enter your Kyan email address
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            placeholder="...@kyan.com"
            name="email"
            value={email}
            required
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            class="bg-pink-600 hover:bg-pink-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
        {error && (
          <div class="flex items-center justify-between">
            <p class="text-red-500 text-xs italic py-2">{error}</p>
          </div>
        )}
      </form>
      <p class="text-center text-gray-500 text-xs">
        &copy;2022 Kyan Christmas.
      </p>
    </div>
  );
}
