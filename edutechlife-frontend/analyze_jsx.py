import re

with open('src/components/IALab.jsx', 'r') as f:
    lines = f.readlines()

in_jsx = False
in_string = False
string_char = ''
element_stack = []
line_numbers = []
element_types = ['div', 'aside', 'header', 'footer', 'section', 'article', 'main', 'nav']

for i, line in enumerate(lines, 1):
    # Manejo de strings para no contar elementos dentro de template strings
    for char in line:
        if not in_string and char in ['"', "'", '`']:
            in_string = True
            string_char = char
        elif in_string and char == string_char:
            in_string = False
            string_char = ''
    
    if in_string:
        continue
    
    # Buscar elementos de apertura
    for element in element_types:
        pattern = fr'<{element}(?:\s[^>]*)?>'
        if re.search(pattern, line):
            element_stack.append(element)
            line_numbers.append(i)
            break
    
    # Buscar elementos de cierre
    for element in element_types:
        pattern = fr'</{element}>'
        if re.search(pattern, line):
            if element_stack:
                last_element = element_stack[-1]
                if last_element == element:
                    element_stack.pop()
                    line_numbers.pop()
                else:
                    print(f'ERROR: Cierre incorrecto en línea {i}. Esperado </{last_element}>, encontrado </{element}>')
            else:
                print(f'ERROR: Cierre sin apertura en línea {i}: {line.strip()}')
            break

print(f'Elementos sin cerrar: {len(element_stack)}')
if element_stack:
    print('Elementos pendientes:')
    for elem, line_num in zip(element_stack, line_numbers):
        print(f'  <{elem}> en línea {line_num}')
    
    # Mostrar contexto de las líneas problemáticas
    print('\nContexto de las líneas problemáticas:')
    for elem, line_num in zip(element_stack, line_numbers):
        print(f'\nLínea {line_num}:')
        start = max(0, line_num - 3)
        end = min(len(lines), line_num + 2)
        for j in range(start, end):
            prefix = '-> ' if j + 1 == line_num else '   '
            print(f'{prefix}{j+1}: {lines[j].rstrip()}')