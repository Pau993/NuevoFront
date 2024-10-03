const apiUrl = 'http://localhost:8080/tasks'

async function obtenerDatos(endpoint) {
    const response = await fetch(`${apiUrl}/${endpoint}`);
    return response.json();
}

// Función principal para generar el gráfico basado en la opción seleccionada
function generarGrafico() {
    const graficoSeleccionado = document.getElementById('grafica').value;

    // Limpiar el contenedor de gráficos antes de generar uno nuevo
    const contenedor = document.getElementById('contenedorGrafico');
    contenedor.innerHTML = '<canvas id="graficoCanvas"></canvas>'; // Reiniciar el canvas
    const ctx = document.getElementById('graficoCanvas').getContext('2d');

    // Lógica para generar el gráfico basado en la selección
    switch (graficoSeleccionado) {
        case 'dificultad':
            obtenerDatos('/dificultad').then(data => {
                generarHistogramaDificultad(ctx, data);
            });
            break;
        case 'finalizadas':
            obtenerDatos('/completadas-tiempo').then(data => {
                generarTareasFinalizadasTiempo(ctx, data);
            });
            break;
        case 'prioridad':
            obtenerDatos('/prioridades').then(data => {
                generarPromediosTareasPrioridad(ctx, data);
            });
            break;
        case 'tiempo':
            obtenerDatos('/tiempo-invertido').then(data => {
                generarTiempoTotalInvertido(ctx, data);
            });
            break;
        default:
            alert("Por favor seleccione una gráfica.");
    }
}

// Función para generar el histograma de dificultad
function generarHistogramaDificultad(ctx, data) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Cantidad de Tareas',
                data: Object.values(data),
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para generar el gráfico de tareas finalizadas por tiempo
function generarTareasFinalizadasTiempo(ctx, data) {
    const fechas = data.map(task => task.fechaFinalizacion); // Asegúrate de tener un campo 'fechaFinalizacion'
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: 'Tareas Finalizadas',
                data: fechas.map(() => 1), // Cada tarea finalizada cuenta como 1
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para generar el gráfico de promedios de tareas por prioridad
function generarPromediosTareasPrioridad(ctx, data) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Número de Tareas',
                data: Object.values(data),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para generar el gráfico de tiempo total invertido por tareas realizadas
function generarTiempoTotalInvertido(ctx, data) {
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Tiempo Total Invertido'],
            datasets: [{
                label: 'Horas',
                data: [data], // Solo una cantidad total
                backgroundColor: ['rgba(153, 102, 255, 0.2)'],
                borderColor: ['rgba(153, 102, 255, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}