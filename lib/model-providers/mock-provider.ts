import { BaseModelProvider, ModelMessage, ModelResponse, ModelAvailability } from "./base-provider";
import { ImageData } from "../image-utils";
import { ModelConfig } from "../model-config";

export class MockProvider extends BaseModelProvider {
  name = "Mock AI (Demo Mode)";
  private config: ModelConfig;

  constructor(config: ModelConfig) {
    super();
    this.config = config;
  }

  async checkAvailability(): Promise<ModelAvailability> {
    return { 
      textModel: true, 
      visionModel: true, 
      errors: [] 
    };
  }

  async generateText(messages: ModelMessage[]): Promise<ModelResponse> {
    console.log('Mock provider: generateText called with messages:', messages.length);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    try {
      const userMessage = messages.find(m => m.role === 'user')?.content || '';
      console.log('Mock provider: processing user message:', userMessage.substring(0, 100) + '...');
      
      const response = this.generateMockLegalResponse(userMessage);
      console.log('Mock provider: generated response length:', response.length);

      return {
        success: true,
        content: response,
        model_used: `${this.config.textModel} (Mock Demo)`
      };
    } catch (error) {
      console.error('Mock provider: Error in generateText:', error);
      return {
        success: false,
        error: `Mock text generation failed: ${error}`,
        model_used: this.config.textModel
      };
    }
  }

  async analyzeImage(imageData: ImageData, prompt: string): Promise<ModelResponse> {
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    try {
      const analysis = this.generateMockImageAnalysis(imageData.fileName, prompt);

      return {
        success: true,
        content: analysis,
        model_used: `${this.config.visionModel} (Mock Demo)`
      };
    } catch (error) {
      return {
        success: false,
        error: `Mock image analysis failed: ${error}`,
        model_used: this.config.visionModel
      };
    }
  }

  private generateMockLegalResponse(userInput: string): string {
    const lowerInput = userInput.toLowerCase();

    // Contract-related queries
    if (lowerInput.includes('contract') || lowerInput.includes('agreement')) {
      return `Based on your question about contracts, here's some general guidance:

**Key Contract Elements**: Every valid contract needs offer, acceptance, consideration, and mutual agreement. Before signing any contract, carefully review all terms and conditions.

**Important Considerations**: 
- Read all fine print and understand cancellation policies
- Ensure all verbal agreements are included in writing
- Consider having complex contracts reviewed by a qualified attorney

**Disclaimer**: This is general information only. For specific contract matters, please consult with a licensed attorney who can review your particular situation and local laws.`;
    }

    // Employment law queries
    if (lowerInput.includes('employment') || lowerInput.includes('workplace') || lowerInput.includes('job')) {
      return `Regarding your employment law question:

**Employee Rights**: You have rights to a safe workplace, fair wages, and protection from discrimination. Employment laws vary by state and jurisdiction.

**Common Issues**: 
- Wage and hour disputes should be documented carefully
- Workplace harassment should be reported through proper channels
- Wrongful termination may have legal remedies available

**Next Steps**: Keep detailed records of any workplace issues. For serious employment matters, consult with an employment law attorney who can advise you based on your specific situation and local laws.`;
    }

    // Landlord/tenant queries
    if (lowerInput.includes('rent') || lowerInput.includes('landlord') || lowerInput.includes('tenant') || lowerInput.includes('lease')) {
      return `For your landlord-tenant question:

**Tenant Rights**: You generally have rights to habitable living conditions, proper notice for entries, and return of security deposits (subject to legitimate deductions).

**Important Points**:
- Document all communications with your landlord in writing
- Know your local rent control and eviction laws
- Security deposits typically must be returned within 14-30 days

**Legal Advice**: Landlord-tenant law varies significantly by location. Contact a local tenant rights organization or attorney for guidance specific to your area and situation.`;
    }

    // Personal injury queries
    if (lowerInput.includes('accident') || lowerInput.includes('injury') || lowerInput.includes('insurance')) {
      return `Regarding your accident or injury question:

**Immediate Steps**: 
- Seek medical attention if injured, even if injuries seem minor
- Document everything: photos, witness information, police reports
- Notify your insurance company promptly

**Important Considerations**:
- Keep all medical records and receipts related to the incident
- Avoid admitting fault or signing anything without legal review
- Be cautious with recorded statements to insurance companies

**Legal Consultation**: Personal injury cases often have time limits for filing claims. Consider consulting with a personal injury attorney for a case evaluation, especially for serious injuries.`;
    }

    // Family law queries
    if (lowerInput.includes('divorce') || lowerInput.includes('custody') || lowerInput.includes('family')) {
      return `For your family law matter:

**Family Law Basics**: Family law covers divorce, child custody, support, and domestic relations. These matters are typically handled in state courts with specific procedures.

**Key Considerations**:
- Child's best interests are paramount in custody decisions
- Financial records are crucial for support calculations
- Mediation may be required before court proceedings

**Professional Guidance**: Family law matters are emotionally challenging and legally complex. Consider consulting with a family law attorney who can explain your rights and options under your state's specific laws.`;
    }

    // Parking ticket queries
    if (lowerInput.includes('parking ticket') || lowerInput.includes('parking violation') || lowerInput.includes('parking fine')) {
      return `Regarding your parking ticket question:

**Parking Ticket Options**:
- Pay the fine by the due date to avoid additional penalties
- Contest the ticket if you believe it was issued in error
- Request a hearing to present your case

**Common Defenses**:
- Faulty or missing signage
- Meter malfunction (keep receipts/photos as evidence)
- Medical emergency or vehicle breakdown
- Incorrect information on the ticket

**Important Deadlines**: Most jurisdictions have strict deadlines for contesting tickets (usually 21-30 days). Missing deadlines can result in additional fines and penalties.

**Documentation**: If contesting, gather photos of signage, parking area, meter receipts, and any other relevant evidence.

**Legal Advice**: For expensive tickets or repeat violations that could affect your license, consider consulting with a traffic attorney.`;
    }

    // Legal notices queries
    if (lowerInput.includes('legal notice') || lowerInput.includes('court notice') || lowerInput.includes('summons') || lowerInput.includes('subpoena')) {
      return `Regarding your legal notice:

**Immediate Action Required**: Legal notices typically have strict deadlines. Do not ignore them.

**Types of Legal Notices**:
- Court summons: You must appear or respond by the specified date
- Subpoenas: You're required to appear as a witness or provide documents
- Demand letters: Someone is making a legal claim against you
- Eviction notices: Landlord is starting eviction proceedings

**Critical Steps**:
- Read the entire document carefully
- Note all deadlines and required actions
- Respond by the deadline, even if just to request more time
- Keep copies of all documents

**Legal Representation**: Many legal notices indicate serious legal proceedings. Contact an attorney immediately to understand your rights and obligations.

**Warning**: Failing to respond to legal notices can result in default judgments, evictions, or other serious consequences.`;
    }

    // Car crash queries
    if (lowerInput.includes('car crash') || lowerInput.includes('car accident') || lowerInput.includes('auto accident') || lowerInput.includes('vehicle accident')) {
      return `Regarding your car accident:

**Immediate Steps at the Scene**:
- Ensure everyone's safety and call 911 if anyone is injured
- Call police to file an accident report
- Exchange insurance and contact information with other drivers
- Take photos of vehicles, damage, license plates, and accident scene
- Get contact information from witnesses

**Important Documentation**:
- Police report number
- Other driver's insurance information
- Photos of all vehicle damage
- Medical records if injured
- Repair estimates and receipts

**Insurance Claims**:
- Report the accident to your insurance company promptly
- Be honest but stick to facts - avoid admitting fault
- Keep detailed records of all communications

**Legal Considerations**: If there are injuries, significant property damage, or disputes about fault, consider consulting with a personal injury attorney. Many offer free consultations for accident cases.

**Time Limits**: Personal injury claims have strict statute of limitations deadlines that vary by state.`;
    }

    // Legal vs illegal keyword queries
    if (lowerInput.includes('legal') || lowerInput.includes('illegal') || lowerInput.includes('lawful') || lowerInput.includes('unlawful')) {
      return `Regarding legal vs illegal activities:

**Understanding Legality**:
- Laws vary significantly by jurisdiction (federal, state, local)
- What's legal in one place may be illegal in another
- Laws change over time through legislation and court decisions
- Ignorance of the law is generally not a defense

**Research Resources**:
- Local and state government websites
- Legal databases and law libraries
- Professional legal counsel
- Bar association referral services

**Common Legal Concepts**:
- Constitutional rights and limitations
- Statutory laws (written by legislatures)
- Common law (developed by courts)
- Administrative regulations (by government agencies)

**When in Doubt**: If you're unsure about the legality of an action:
- Research applicable laws in your jurisdiction
- Consult with a qualified attorney
- Contact relevant government agencies
- Err on the side of caution

**Important**: This is general information only. For specific questions about what is legal or illegal in your situation and jurisdiction, consult with a licensed attorney.`;
    }

    // Criminal law queries
    if (lowerInput.includes('criminal') || lowerInput.includes('arrest') || lowerInput.includes('police')) {
      return `Regarding your criminal law question:

**Constitutional Rights**: 
- Right to remain silent - use it
- Right to an attorney - request one immediately
- Right to refuse searches without a warrant

**If Arrested**: 
- Don't resist, even if you believe the arrest is wrong
- Don't discuss your case with anyone except your attorney
- Contact a criminal defense lawyer as soon as possible

**Critical**: Criminal matters have serious consequences. If you're facing charges or investigation, immediately contact a qualified criminal defense attorney. Do not attempt to handle criminal matters without legal representation.`;
    }

    // Default general legal response
    return `Thank you for your legal question. Here's some general guidance:

**General Legal Principles**: 
- Laws vary significantly by jurisdiction and change frequently
- Documentation and evidence are crucial in legal matters
- Time limits (statutes of limitations) apply to most legal claims

**Recommended Actions**:
- Gather and preserve all relevant documents and evidence
- Keep detailed records of dates, communications, and events
- Research your local laws or consult legal resources

**Important Disclaimer**: This is general legal information only and not specific legal advice. Laws vary by location and individual circumstances matter greatly. For matters affecting your legal rights, please consult with a qualified attorney licensed in your jurisdiction who can provide advice tailored to your specific situation.

Would you like me to help you find resources for legal assistance in your area?`;
  }

  private generateMockImageAnalysis(fileName: string, prompt: string): string {
    const fileExt = fileName.toLowerCase().split('.').pop() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
      return `**Document Analysis** (Mock Demo):

I can see you've uploaded an image file "${fileName}". In a production environment, this would be analyzed by our vision AI model to extract text, identify document types, and understand visual legal content.

**Potential Document Types**: Based on common legal documents, this could be:
- Contract or agreement pages
- Court documents or legal notices  
- Insurance forms or claims
- Property documents or leases
- Business licenses or permits

**Analysis Capabilities**: The AI vision system would typically:
- Extract and read text from the document
- Identify key legal terms and clauses
- Highlight important dates, signatures, and monetary amounts
- Categorize document type and purpose

**Next Steps**: For actual document analysis, please ensure documents are clear and readable. Consider consulting with a qualified attorney for review of important legal documents.

*Note: This is a demonstration response. Real document analysis requires the full AI vision system to be active.*`;
    }

    return `**Image Analysis** (Mock Demo):

I can see you've uploaded "${fileName}". In production mode, our AI vision system would analyze this image for legal relevance, such as:

- Accident scene documentation
- Property damage assessment  
- Evidence preservation
- Incident documentation
- Legal document photography

**Mock Analysis**: This appears to be an image that could contain legally relevant information. For actual analysis, the full vision AI would examine details, extract text if present, and provide specific insights.

**Legal Context**: If this relates to a legal matter, ensure you have proper copies and backup documentation. Consider consulting with an attorney if this evidence is important to your case.

*Note: This is a demonstration. Full image analysis requires the complete AI system to be operational.*`;
  }
}
