export const uploadFile = async (formData) => {
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data;
  };
  