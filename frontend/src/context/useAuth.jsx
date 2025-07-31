// api.js or authHelpers.js
export const login = async (formData) => {
  const res = await fetch("https://mini-project-college.onrender.com/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }

  return await res.json(); 
};
