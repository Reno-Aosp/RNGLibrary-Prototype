package random.num.gen.rng.Fuzzy;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.fuzzylite.Engine;
import com.fuzzylite.imex.FclImporter;
import com.fuzzylite.variable.InputVariable;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Simple wrapper around jfuzzylite that loads a Sugeno FCL file,
 * sets assignment/exam scores, and returns the final score.
 *
 * Dependencies: jfuzzylite (com.fuzzylite) and Lombok.
 */
@Getter
@Setter
@ToString
public class SugenoStudentEvaluator {

    /** The fuzzy inference engine loaded from the FCL file */
    private Engine engine;

    /**
     * Constructor - loads the FCL from classpath (or fallback paths).
     *
     * @param fclResourceName name of the FCL file (e.g., "student.fcl")
     */
    public SugenoStudentEvaluator(String fclResourceName) {
        String fclText = loadFclContent(fclResourceName);
        this.engine = new FclImporter().fromString(fclText);
        if (engine == null) {
            throw new RuntimeException("Cannot load FCL file: " + fclResourceName);
        }

        StringBuilder status = new StringBuilder();
        if (!engine.isReady(status)) {
            throw new IllegalStateException("Fuzzy engine is not ready: " + status);
        }
    }

    /**
     * Evaluates the student score for given assignment and exam values.
     *
     * @param assignment assignment score (0‑100)
     * @param exam       exam score (0‑100)
     * @return final score (0‑100) as computed by the Sugeno inference
     */
    public double evaluate(double assignment, double exam) {
        // Set input variables
        InputVariable assignmentVar = engine.getInputVariable("assignment");
        InputVariable examVar = engine.getInputVariable("exam");
        if (assignmentVar == null || examVar == null) {
            throw new IllegalStateException("Input variables 'assignment' and/or 'exam' were not found");
        }
        assignmentVar.setValue(assignment);
        examVar.setValue(exam);

        // Perform inference
        engine.process();

        // Retrieve output
        if (!engine.hasOutputVariable("final_score")) {
            throw new IllegalStateException("Output variable 'final_score' not found");
        }
        return engine.getOutputValue("final_score"); // crisp result
    }

    private static String loadFclContent(String fclResourceName) {
        if (fclResourceName == null || fclResourceName.isBlank()) {
            throw new IllegalArgumentException("fclResourceName must not be blank");
        }

        String normalized = fclResourceName.startsWith("/")
                ? fclResourceName.substring(1)
                : fclResourceName;

        // Preferred: load from classpath (e.g. src/main/resources/student.fcl)
        try (InputStream classpathStream = SugenoStudentEvaluator.class
                .getClassLoader()
                .getResourceAsStream(normalized)) {
            if (classpathStream != null) {
                return new String(classpathStream.readAllBytes(), StandardCharsets.UTF_8);
            }
        } catch (IOException ex) {
            throw new RuntimeException("Failed reading FCL from classpath: " + normalized, ex);
        }

        // Fallback for local development when file is not yet in resources.
        Path[] candidates = new Path[] {
                Paths.get(normalized),
                Paths.get("src", "main", "resources", normalized),
                Paths.get("src", "main", "java", "random", "num", "gen", "rng", "Fuzzy", normalized)
        };

        for (Path candidate : candidates) {
            if (Files.exists(candidate)) {
                try {
                    return Files.readString(candidate, StandardCharsets.UTF_8);
                } catch (IOException ex) {
                    throw new RuntimeException("Failed reading FCL file: " + candidate, ex);
                }
            }
        }

        throw new RuntimeException("Cannot find FCL file: " + fclResourceName);
    }

    /** Demo main method */
    public static void main(String[] args) {
        // Assuming student.fcl is on the classpath (e.g., src/main/resources)
        SugenoStudentEvaluator evaluator = new SugenoStudentEvaluator("student.fcl");

        double[][] testCases = {
                {70, 80},
                {40, 30},
                {60, 70},
                {85, 90},
                {30, 80}
        };

        System.out.println("Assignment | Exam -> Final Score (Sugeno)");
        System.out.println("----------------------------------------");
        for (double[] tc : testCases) {
            double finalScore = evaluator.evaluate(tc[0], tc[1]);
            System.out.printf("%10.0f | %4.0f -> %10.2f%n", tc[0], tc[1], finalScore);
        }
    }
}
